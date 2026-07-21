import { Megaphone, Plus, Save, Trash2 } from "lucide-react";

import db from "@/lib/db";

import {
    createAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
} from "./actions";

const inputClass =
    "border-border bg-bg text-input placeholder:text-text-disabled w-full rounded-md border px-3 outline-none focus:border-text-secondary";

export default async function AdminAnnouncementsPage() {
    const announcements = await db.announcement.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">공지사항 관리</h1>
                <p className="text-caption mt-1">
                    홈에 노출할 서비스 공지를 관리합니다.
                </p>
            </section>

            <form
                action={createAnnouncement}
                className="bg-surface rounded-card grid gap-3 p-3"
            >
                <h2 className="text-section flex items-center gap-2">
                    <Plus className="size-4" /> 공지 추가
                </h2>
                <input
                    name="title"
                    required
                    maxLength={80}
                    placeholder="공지 제목"
                    className={`${inputClass} h-10`}
                />
                <textarea
                    name="content"
                    required
                    maxLength={2000}
                    rows={5}
                    placeholder="공지 내용"
                    className={`${inputClass} resize-y py-2`}
                />
                <div className="flex items-center justify-between gap-3">
                    <label className="text-body-muted flex cursor-pointer items-center gap-2">
                        <input type="checkbox" name="isPublished" />
                        바로 공개
                    </label>
                    <button className="bg-text-primary text-bg flex h-10 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-bold">
                        <Megaphone className="size-4" /> 등록
                    </button>
                </div>
            </form>

            <section className="flex flex-col gap-3">
                {announcements.map((announcement) => (
                    <article
                        key={announcement.id}
                        className="bg-surface rounded-card p-3"
                    >
                        <form
                            action={updateAnnouncement}
                            className="grid gap-3"
                        >
                            <input
                                type="hidden"
                                name="id"
                                value={announcement.id}
                            />
                            <input
                                name="title"
                                required
                                maxLength={80}
                                defaultValue={announcement.title}
                                className={`${inputClass} h-10 font-semibold`}
                            />
                            <textarea
                                name="content"
                                required
                                maxLength={2000}
                                rows={5}
                                defaultValue={announcement.content}
                                className={`${inputClass} resize-y py-2`}
                            />
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-body-muted flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        defaultChecked={
                                            announcement.isPublished
                                        }
                                    />
                                    홈에 공개
                                </label>
                                <button className="border-border hover:bg-surface-muted flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm font-bold transition-colors">
                                    <Save className="size-4" /> 저장
                                </button>
                            </div>
                        </form>
                        <form
                            action={deleteAnnouncement}
                            className="border-divider mt-3 border-t pt-3"
                        >
                            <input
                                type="hidden"
                                name="id"
                                value={announcement.id}
                            />
                            <button className="border-danger/40 text-danger hover:bg-danger/10 flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border text-sm font-bold transition-colors">
                                <Trash2 className="size-4" /> 삭제
                            </button>
                        </form>
                    </article>
                ))}
                {announcements.length === 0 ? (
                    <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                        등록된 공지사항이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
