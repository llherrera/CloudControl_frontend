import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store'
import { selectOption } from '@/store/content/contentSlice';

import { ButtonComponent } from '../Buttons';
import { NavBarProps } from '@/interfaces';

export const NavBar = ( props: NavBarProps) => {
    const dispatch = useAppDispatch();
    const { index } = useAppSelector(store => store.content);

    const handleClick = (i: number, action: ()=> void) => {
        dispatch(selectOption(i));
        action();
    };

    return (
        <ul className={`tw-py-4
                        tw-flex tw-flex-row
                        tw-justify-around
                        xl:tw-flex-col xl:tw-px-10
                        tw-bg-navBar`}>
            {props.buttons.map((button, i) => (
                <li className='tw-shadow tw-my-1' key={i}>
                    <ButtonComponent
                        text={button.text}
                        inside={button.inside}
                        onClick={ ()=>handleClick(i, button.onClick) }
                        icon={button.icon}
                        bgColor={i=== index ? `tw-bg-${button.textColor}` : `tw-bg-${button.bgColor}`}
                        textColor={i=== index ? `tw-text-${button.bgColor}` : `tw-text-${button.textColor}`}
                    />
                </li>
            ))}
        </ul>
    );
}