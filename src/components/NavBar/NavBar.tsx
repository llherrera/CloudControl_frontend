import React, { useState } from 'react';
import { ButtonComponent } from '../Buttons';

interface ButtonProps {
    text: string,
    inside: boolean,
    onClick: () => void,
    bgColor?: string,
    textColor?: string,
    icon?: ()=>JSX.Element
}

interface Props {
    buttons: ButtonProps[],
    bgColor?: string
}

export const NavBar = ( props: Props) => {
    const [index, setIndex] = useState(0);

    const handleClick = (i: number, action: ()=> void) => {
        setIndex(i);
        action();
    };

    return (
        <ul className={`tw-px-10 
                        tw-flex tw-flex-col
                        tw-bg-navBar
                        tw-justify-around`}>
            {props.buttons.map((button, i) => (
                <li className='tw-shadow tw-my-1' key={i}>
                    <ButtonComponent
                        text={button.text}
                        inside={true}
                        onClick={() => handleClick(i, button['onClick'])}
                        icon={button.icon}
                        bgColor={i=== index ? button.textColor : button.bgColor}
                        textColor={i=== index ? button.bgColor : button.textColor}
                    />
                </li>
            ))}
        </ul>
    );
}