// @vitest-environment jsdom
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from "@testing-library/react";
import { createElement, useSyncExternalStore } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import useUrlSearchField from "@/lib/hooks/use-url-search-field";

type CommitSpy = ReturnType<typeof vi.fn<(q: string) => void>>;

// 화면처럼 반영한 검색어가 곧바로 주소 값(query)으로 돌아오게 한다
function createAddress(initial: string) {
    let q = initial;
    const listeners = new Set<() => void>();
    return {
        get: () => q,
        set(next: string) {
            q = next;
            for (const listener of listeners) listener();
        },
        subscribe(listener: () => void) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
}

function SearchPage({
    address,
    onCommit,
}: {
    address: ReturnType<typeof createAddress>;
    onCommit: CommitSpy;
}) {
    const query = useSyncExternalStore(address.subscribe, address.get);
    const search = useUrlSearchField({
        query,
        onCommit: (q) => {
            onCommit(q);
            address.set(q);
        },
    });
    return createElement(
        "form",
        { role: "search" },
        createElement("input", { type: "search", ...search.inputProps }),
        createElement(
            "button",
            { type: "button", onClick: search.clear },
            "지우기"
        )
    );
}

function mount(options: { q?: string } = {}) {
    const address = createAddress(options.q ?? "");
    const onCommit: CommitSpy = vi.fn();
    const props = { address, onCommit };
    const view = render(createElement(SearchPage, props));
    const input = screen.getByRole<HTMLInputElement>("searchbox");
    return {
        address,
        onCommit,
        input,
        type: (value: string) => fireEvent.change(input, { target: { value } }),
        compose(steps: string[]) {
            fireEvent.compositionStart(input);
            for (const value of steps) {
                fireEvent.change(input, { target: { value } });
            }
        },
        endComposition: () => fireEvent.compositionEnd(input),
        clear: () => fireEvent.click(screen.getByRole("button")),
        replaceOnCommit: (next: CommitSpy) =>
            view.rerender(
                createElement(SearchPage, { ...props, onCommit: next })
            ),
    };
}

describe("검색 입력 훅(useUrlSearchField)", () => {
    afterEach(cleanup);

    describe("입력 반영", () => {
        it("글자마다 그 값으로 바로 반영한다", () => {
            const page = mount();
            page.type("s");
            expect(page.onCommit).toHaveBeenLastCalledWith("s");
            page.type("sa");
            expect(page.onCommit).toHaveBeenLastCalledWith("sa");
            expect(page.onCommit).toHaveBeenCalledTimes(2);
            expect(page.input.value).toBe("sa");
        });

        it("앞뒤 공백을 떼지 않는다", () => {
            const page = mount();
            page.type(" sa ");
            expect(page.onCommit).toHaveBeenCalledWith(" sa ");
            expect(page.input.value).toBe(" sa ");
        });

        it("조합 중에는 입력 값만 바꾸고 조합이 끝나면 한 번 반영한다", () => {
            const page = mount();
            page.compose(["ㅅ", "사", "산"]);
            expect(page.input.value).toBe("산");
            expect(page.onCommit).not.toHaveBeenCalled();
            page.endComposition();
            expect(page.onCommit).toHaveBeenCalledTimes(1);
            expect(page.onCommit).toHaveBeenCalledWith("산");
            expect(page.input.value).toBe("산");
        });

        it("조합이 끝난 뒤의 입력은 다시 글자마다 반영한다", () => {
            const page = mount();
            page.compose(["산"]);
            page.endComposition();
            page.type("산a");
            expect(page.onCommit).toHaveBeenLastCalledWith("산a");
            expect(page.onCommit).toHaveBeenCalledTimes(2);
        });

        it("지우기는 입력을 비우고 빈 값을 반영한다", () => {
            const page = mount({ q: "sa" });
            expect(page.input.value).toBe("sa");
            page.clear();
            expect(page.input.value).toBe("");
            expect(page.onCommit).toHaveBeenCalledTimes(1);
            expect(page.onCommit).toHaveBeenCalledWith("");
        });

        it("렌더마다 바뀌는 onCommit 중 마지막 것을 부른다", () => {
            const page = mount();
            page.type("s");
            const next: CommitSpy = vi.fn();
            page.replaceOnCommit(next);
            page.type("sa");
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith("sa");
            expect(page.onCommit).toHaveBeenCalledTimes(1);
        });
    });

    describe("밖에서 바뀐 검색어", () => {
        it("처음 입력 값은 주소의 검색어다", () => {
            const page = mount({ q: "ma" });
            expect(page.input.value).toBe("ma");
            expect(page.onCommit).not.toHaveBeenCalled();
        });

        it("주소의 검색어가 밖에서 바뀌면 입력 값이 따라가고 반영은 하지 않는다", () => {
            const page = mount();
            page.type("sa");
            act(() => page.address.set("ma"));
            expect(page.input.value).toBe("ma");
            expect(page.onCommit).toHaveBeenCalledTimes(1);
            act(() => page.address.set(""));
            expect(page.input.value).toBe("");
            expect(page.onCommit).toHaveBeenCalledTimes(1);
        });

        it("아직 반영하지 않은 입력 값은 다시 렌더해도 남는다", () => {
            const page = mount();
            page.compose(["ㅅ", "사"]);
            page.replaceOnCommit(page.onCommit);
            expect(page.input.value).toBe("사");
            expect(page.onCommit).not.toHaveBeenCalled();
        });
    });
});
