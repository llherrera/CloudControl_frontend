import { NavBarProps } from '@/interfaces';

export const NavBar = ( {children}: NavBarProps) => {
    return (
        <ul className={`tw-py-4
                        tw-flex tw-flex-row
                        tw-justify-around
                        xl:tw-flex-col xl:tw-px-10
                        tw-bg-navBar`}>
            {children}
        </ul>
    );
}