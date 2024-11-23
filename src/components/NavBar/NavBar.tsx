import { NavBarProps } from '@/interfaces';

export const NavBar = ( {children}: NavBarProps) => {
    return (
        <ul className={`tw-py-4
                        tw-flex tw-flex-row
                        tw-justify-between
                        tw-bg-navBar`}>
            {children}
        </ul>
    );
}