import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps {
    errors?: string[];
    name: string;
}

const _Input = (
    {
        errors = [],
        name,
        ...rest
    }: FormInputProps & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>
) => {
    return (
        <div className="flex flex-col gap-2">
            <input
                id={name}
                ref={ref}
                name={name}
                className="bg-transparent rounded-lg px-4 w-full h-10 focus:outline-none ring-1 focus:ring-4 transition ring-dark-secondary focus:ring-dark-tertiary placeholder:text-white-secondary"
                {...rest}
            />
            {errors.map((error, index) => (
                <span key={index} className="text-red-500 font-medium">
                    {error}
                </span>
            ))}
        </div>
    );
};

export default forwardRef(_Input);
