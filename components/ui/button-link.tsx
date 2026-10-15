import Link from "next/link";
import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

import { foundationButtonClass } from "./button";

type ButtonAppearance = NonNullable<
    Parameters<typeof foundationButtonClass>[0]
>;
type ButtonLinkProps = ButtonAppearance &
    (
        | (ComponentPropsWithRef<typeof Link> & { plain?: false })
        | (ComponentPropsWithRef<"a"> & { plain: true })
    );

/** 이동용 버튼 모양 링크. OAuth·외부 주소·북마클릿은 plain으로 네이티브 a를 사용한다. */
export default function ButtonLink({
    variant,
    size,
    destructiveFilled,
    className,
    ...props
}: ButtonLinkProps) {
    const classes = cn(
        foundationButtonClass({ variant, size, destructiveFilled }),
        className
    );
    if (props.plain) {
        const { plain: _plain, ...anchorProps } = props;
        void _plain; // 내부 선택 속성은 DOM에 전달하지 않는다.
        return <a className={classes} {...anchorProps} />;
    }
    const { plain: _plain, ...linkProps } = props;
    void _plain;
    return <Link className={classes} {...linkProps} />;
}
