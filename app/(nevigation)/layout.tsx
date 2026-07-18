import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import SkipLink from "@/components/layout/skipLink";

export default function NeviationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-bg min-h-screen">
            <div className="bg-bg mx-auto flex min-h-screen w-full max-w-97.5 flex-col">
                <SkipLink />
                <Header />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
