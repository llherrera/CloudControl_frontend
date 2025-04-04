import { BtnProps, PQRSBtnProps } from "@/interfaces";

export const ButtonComponent = ( props : BtnProps ) => {
    return (
        <div className="tw-flex">
            <button type="submit"
                    title={props.text}
                    onClick={props.onClick}
                    className={`hover:tw-bg-navBar ${props.bgColor}
                                tw-border tw-border-greenBtn tw-rounded
                                tw-w-16 tw-h-16 tw-p-4
                                md:tw-w-20 md:tw-h-20 md:tw-text-[10px]
                                xl:tw-w-24 xl:tw-h-24 xl:tw-text-[12px]
                                2xl:tw-w-28 2xl:tw-h-28 2xl:tw-text-base
                                tw-flex tw-flex-col
                                tw-justify-center tw-items-center`}>
                {props.src ? <img src={props.src} alt="icon" className="tw-w-10 tw-h-10" /> : null}
                {props.icon ? props.icon : null}
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

export const PQRSButton = ({title, desc, navigate}: PQRSBtnProps) => (
    <button className=' tw-bg-white
                        tw-w-40 tw-p-2
                        tw-rounded
                        tw-flex tw-flex-col
                        tw-justify-between
                        tw-text-left'
            onClick={navigate}>
        <p className='tw-font-bold'>
            {title}
        </p>
        <p className=''>
            {desc}
        </p>
        <span className='tw-rotate-90
                        tw-self-end'>
            ▲
        </span>
    </button>
);