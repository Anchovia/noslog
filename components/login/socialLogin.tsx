import Link from "next/link";

interface SocialLoginProps {
    text: string;
    url: string;
}

export default function SocialLogin({ text, url }: SocialLoginProps) {
    return (
        <Link href={url} className="rounded-xl bg-orange-500 px-4 py-2.5">
            {text}
        </Link>
    );
}
