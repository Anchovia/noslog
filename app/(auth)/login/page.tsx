import LoginPage from "@/features/auth/components/loginPage";

export default async function LoginRoute({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; returnTo?: string }>;
}) {
    return <LoginPage {...await searchParams} />;
}
