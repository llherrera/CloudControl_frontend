import { BtnProps } from "@/interfaces";

export const ButtonComponent = ( props : BtnProps ) => {
    return (
        <div className="tw-flex">
            <button type="submit"
                    title={props.text}
                    onClick={props.onClick}
                    className={`hover:tw-bg-navBar
                                ${props.bgColor}
                                tw-border 
                                tw-border-greenBtn
                                tw-p-4 tw-rounded
                                tw-w-16 tw-h-16
                                md:tw-w-20 md:tw-h-20
                                lg:tw-w-28 lg:tw-h-28
                                tw-flex tw-flex-col
                                tw-justify-center
                                tw-items-center`}>
                    {props.src ? 
                    <img src={props.src} alt="icon" className="tw-w-10 tw-h-10" />
                    : null}
                    {props.icon ?
                    props.icon
                    : null}
                {props.inside ? 
                <p className={` tw-ml-3 
                                tw-flex tw-flex-wrap 
                                tw-font-montserrat 
                                tw-self-center
                                ${props.textColor}
                                tw-hidden lg:tw-block
                                `}>
                    {props.text}</p>
                : null
                }
            </button>
            {props.inside ? null :
            <p className="  tw-ml-3 
                            tw-font-montserrat 
                            tw-self-center
                            tw-hidden md:tw-block">
                {props.text}</p>
            }
        </div>
    );
}