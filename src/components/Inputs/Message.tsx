import { PropsMessage } from "@/interfaces";

export const Message = ({callback, className, children}: PropsMessage) => {
    return (
        <button
            className={`
                tw-border tw-rounded
                tw-bg-[#626d75] hover:tw-bg-[#D9D9D9]
                tw-transition hover:tw--translate-y-2
                tw-w-11/12 tw-p-2
                tw-text-justify tw-text-white hover:tw-text-black
                ${className}
            `}
            onClick={() => callback(children)}>
            <p>
                {children}
            </p>
        </button>
    );
}