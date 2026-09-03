export default function ExamFieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-danger mt-1 text-xs" role="alert">
            {message}
        </p>
    ) : null;
}
