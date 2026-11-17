"use client";

import { useState } from "react";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminPager,
    adminRowOpenProps,
    AdminStatus,
    AdminTable,
} from "@/components/admin/admin-card";
import ActionMenu from "@/components/ui/action-menu";
import Button from "@/components/ui/button";
import { ADMIN_PAGE_SIZE, adminPageHref } from "@/lib/admin/page";

import ArcadeForm, { type ArcadeFormRecord } from "./arcade-form";

// 고칠 오락실 하나만 서랍에 폼을 그린다. 열 때마다 key 를 바꿔 지난번 입력을 남기지 않는다
type Editing = { arcade: ArcadeFormRecord | null; key: number };

export default function ArcadeAdminList({
    appKey,
    arcades,
    page,
    total,
}: {
    appKey: string;
    arcades: ArcadeFormRecord[];
    page: number;
    total: number;
}) {
    const [editing, setEditing] = useState<Editing | null>(null);
    const [open, setOpen] = useState(false);

    function openEditor(arcade: ArcadeFormRecord | null) {
        setEditing((current) => ({ arcade, key: (current?.key ?? 0) + 1 }));
        setOpen(true);
    }

    return (
        <AdminCard>
            <AdminCardHead
                title="오락실"
                actions={
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEditor(null)}
                    >
                        새 오락실
                    </Button>
                }
            />
            {arcades.length === 0 ? (
                <AdminCardEmpty>등록된 오락실이 없습니다.</AdminCardEmpty>
            ) : (
                <AdminTable>
                    <thead>
                        <tr>
                            <th scope="col">이름</th>
                            <th scope="col">지역</th>
                            <th scope="col">주소</th>
                            <th scope="col">기체</th>
                            <th scope="col">사진</th>
                            <th scope="col">선택한 사람</th>
                            <th scope="col">선택 목록</th>
                            <th scope="col">
                                <span className="sr-only">메뉴</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {arcades.map((arcade) => (
                            <tr
                                key={arcade.id}
                                {...adminRowOpenProps(() => openEditor(arcade))}
                            >
                                <td>{arcade.name}</td>
                                <td>{arcade.region ?? "-"}</td>
                                <td className="nl-admin-table__wrap">
                                    {arcade.address?.replaceAll("\n", " ") ||
                                        "-"}
                                </td>
                                <td>{arcade.cabinets.length}대</td>
                                <td>{arcade.photos.length}장</td>
                                <td>{arcade.userCount}명</td>
                                <td>
                                    <AdminStatus
                                        tone={
                                            arcade.isActive
                                                ? "success"
                                                : "empty"
                                        }
                                    >
                                        {arcade.isActive ? "표시" : "숨김"}
                                    </AdminStatus>
                                </td>
                                <td className="nl-admin-table__menu">
                                    <ActionMenu
                                        label={arcade.name + " 메뉴"}
                                        items={[
                                            {
                                                label: "고치기",
                                                onSelect: () =>
                                                    openEditor(arcade),
                                            },
                                        ]}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </AdminTable>
            )}
            <AdminPager
                page={page}
                pageSize={ADMIN_PAGE_SIZE}
                total={total}
                unit="곳"
                hrefFor={(next) => adminPageHref("/admin/arcades", {}, next)}
            />
            {editing ? (
                editing.arcade ? (
                    <ArcadeForm
                        key={editing.key}
                        mode="update"
                        appKey={appKey}
                        arcade={
                            arcades.find(
                                (arcade) => arcade.id === editing.arcade?.id
                            ) ?? editing.arcade
                        }
                        open={open}
                        onOpenChange={setOpen}
                    />
                ) : (
                    <ArcadeForm
                        key={editing.key}
                        mode="create"
                        appKey={appKey}
                        open={open}
                        onOpenChange={setOpen}
                    />
                )
            ) : null}
        </AdminCard>
    );
}
