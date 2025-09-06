import Link from "next/link";

interface SocialLoginProps {
    text: string;
    url: string;
}

export default function SocialLogin({ text, url }: SocialLoginProps) {
    return (
        <Link href={url} className="px-4 py-2.5 bg-orange-500 rounded-xl">
            {text}
        </Link>
    );
}
