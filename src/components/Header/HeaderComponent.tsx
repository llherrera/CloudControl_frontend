//import cclogo from "@/assets/images/logo-cc.png";
import cclogo from "@/assets/images/AlTablero.png";
import { HeaderProps } from "@/interfaces";

export const Header = ( {children}: HeaderProps) => {
    return (
        <main className="   tw-mx-auto tw-my-4
                            tw-grid 
                            md:tw-grid-cols-2
                            tw-items-center
                            tw-h-screen">
            <div className="tw-border-r md:tw-border-black
                            tw-pr-4 tw-m-6
                            tw-justify-self-end">
                <img src={cclogo} width={350}/>
                <p className="tw-font-montserrat tw-font-bold">
                    Selecciona un usuario en la derecha para comenzar</p>
            </div>
            <ul className="tw-pl-3 tw-flex md:tw-flex-col tw-justify-center tw-gap-3">
                {children}
            </ul>
        </main>
    );
}