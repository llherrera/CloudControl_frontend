interface Props {
    text: string,
    src?: string,
    inside: boolean,
    icon?: ()=>JSX.Element,
    onClick: () => void,
    bgColor?: string,
    textColor?: string
}

export const ButtonComponent = ( props : Props ) => {
    return (
        <div className="tw-flex">
            <button type="submit"
                    onClick={props.onClick}
                    className={`${props.bgColor ? `tw-bg-[${props.bgColor}]` : 'tw-bg-[#008432]'}
                                hover:tw-bg-[#00a651]
                                tw-border ${props.bgColor ? `tw-border-[${props.bgColor}]` : 'tw-border-[#008432]'}
                                tw-p-4 tw-rounded
                                tw-w-28 tw-h-28
                                tw-flex tw-flex-col
                                tw-justify-center
                                tw-items-center`}>
                    {props.src ? 
                    <img src={props.src} alt="icon" className="tw-w-10 tw-h-10" />
                    : null}
                    {props.icon ?
                    props.icon()
                    : null}
                {props.inside ? 
                <p className={` tw-ml-3 
                                tw-flex tw-flex-wrap 
                                tw-font-montserrat 
                                tw-self-center
                                ${props.textColor ? `tw-text-[${props.textColor}]`:'tw-text-[#FFFFFF]'}`}>
                    {props.text}</p>
                : null
                }
            </button>
            {props.inside ? null :
            <p className="  tw-ml-3 
                            tw-font-montserrat 
                            tw-self-center">
                {props.text}</p>
            }
        </div>
    );
}