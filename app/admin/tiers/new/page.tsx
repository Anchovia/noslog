import { createTierList } from "@/app/admin/tiers/actions";
import TierListForm from "@/components/admin/tierListForm";

export default function NewTierListPage() {
    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">서열표 추가</h1>
                <p className="text-caption mt-1">
                    서열표를 만든 뒤 상수 구간과 채보를 배치합니다.
                </p>
            </section>
            <TierListForm
                action={createTierList}
                tierList={{
                    slug: "",
                    title: "",
                    mode: "basic",
                    description: "",
                    status: "draft",
                }}
            />
        </div>
    );
}
