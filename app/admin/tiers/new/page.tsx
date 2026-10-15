import TierListForm from "@/features/tiers/components/tier-list-form";

export default function NewTierListPage() {
    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">
                    서열표 추가
                </h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    서열표를 만든 뒤 상수 구간과 채보를 배치합니다.
                </p>
            </section>
            <TierListForm
                tierList={{
                    slug: "",
                    title: "",
                    mode: "basic",
                    goal: "s",
                    description: "",
                    status: "draft",
                }}
            />
        </div>
    );
}
