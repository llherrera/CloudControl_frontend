import { useState } from "react";

interface Props {
    title: string
    children: JSX.Element | JSX.Element[]
}

export const DropdownC = ({title, children}: Props) => {
    const [show, setShow] = useState(false);
    const handlerClick = () => setShow(!show);

    return (
        <div className="tw-mt-4 tw-px-36">
            <div 
                className={`tw-flex tw-justify-between tw-items-center
                            tw-cursor-pointer tw-py-4
                            tw-bg-white
                            tw-border tw-border-gray-300
                            tw-rounded-md`}
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
