import type { Locale } from "@/lib/i18n/routing";

// 글자 종류로 글의 언어를 가린다(2026-09-22 — 의견 · 답글 번역 버튼을 보는 사람 언어와 다른 글에만 두려고).
// 외부 호출 없이: 한글이 있으면 한국어, 가나가 있으면 일본어, 한자만이면 일본어(이 사이트 글의 대부분),
// 라틴 글자만이면 영어. 글자가 한둘뿐이면(숫자 · 이모지 · 「990k」) 알 수 없음
export function detectTextLanguage(text: string): Locale | null {
    let hangul = 0;
    let kana = 0;
    let han = 0;
    let latin = 0;
    for (const char of text) {
        if (/\p{Script=Hangul}/u.test(char)) hangul++;
        else if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(char)) kana++;
        else if (/\p{Script=Han}/u.test(char)) han++;
        else if (/\p{Script=Latin}/u.test(char)) latin++;
    }
    // 「990k」 처럼 글자가 한둘뿐이면 번역할 것이 없다
    if (hangul + kana + han + latin < 2) return null;
    if (hangul && hangul >= kana) return "ko";
    if (kana || han) return "ja";
    if (latin) return "en";
    return null;
}
