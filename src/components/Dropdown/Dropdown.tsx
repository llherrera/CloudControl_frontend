import { useState } from "react";
import { DropdownProps } from "@/interfaces";

export const DropdownC = ({title, children, m, bg, textColor}: DropdownProps) => {
    const [show, setShow] = useState(false);
    const handlerClick = () => setShow(!show);

    return (
        <div className={`tw-${m} tw-px-36`}>
            <div 
                className={`tw-flex tw-justify-between tw-items-center
                            tw-cursor-pointer tw-py-4
                            tw-bg-${bg ?? 'white'}
                            tw-border tw-border-gray-300
                            tw-rounded-md
                            tw-text-${textColor ?? 'black'}`}
                onClick={handlerClick}>
                <h2 className="tw-text tw-mx-4">
                    {title}
                </h2>
                <p className="tw-mx-4">
                    {show ? '↑' : '↓'}
                </p>
            </div>
            {show &&
            <div className="tw-p-4 tw-rounded-b-md tw-bg-white
                            tw-border tw-border-t-0 tw-border-gray-300">
                {children}
            </div>
            }
        </div>
    );
}
