import React from 'react';

interface Props {
    buttons: React.ReactNode[],
    bgColor?: string,

}

export const NavBar = ( props: Props) => {
    return (
        <ul className={`tw-px-10 tw-h-[32rem]
                        tw-flex tw-flex-col
                        ${props.bgColor ? `tw-bg-[${props.bgColor}]` : 'tw-bg-[#D9D9D9]'}
                        tw-justify-around`}>
            {props.buttons.map((button, i) => (
                <li className='tw-shadow' key={i}>{button}</li>
            ))}
        </ul>
    );
}