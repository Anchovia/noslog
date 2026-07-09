import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps {
    errors?: string[];
    name: string;
}

const _Input = (
    {
        errors = [],
        name,
        value,
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
                className="ring-dark-secondary focus:ring-dark-tertiary placeholder:text-white-secondary h-10 w-full rounded-lg bg-transparent px-4 ring-1 transition focus:ring-4 focus:outline-hidden"
                {...rest}
            />
            {errors.map((error, index) => (
                <span key={index} className="font-medium text-red-500">
                    {error}
                </span>
            ))}
        </div>
    );
};

export default forwardRef(_Input);
