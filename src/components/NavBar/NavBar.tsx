import { NavBarProps } from '@/interfaces';

export const NavBar = ({ children }: NavBarProps) => {
    return (
        <ul
            className={`
                tw-py-4
                tw-flex tw-flex-row
                tw-justify-around
                tw-bg-navBar
                tw-w-auto
                tw-top-0 tw-z-20
                xl:tw-stiky tw-sticky
                xl:tw-flex-col
                xl:tw-px-10
                xl:tw-h-screen
                xl:tw-left-0
            `}
        >
            {children}
        </ul>
    );
};
