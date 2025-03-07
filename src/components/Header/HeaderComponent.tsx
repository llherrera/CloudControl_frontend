//import cclogo from "@/assets/images/logo-cc.png";
//import cclogo from "@/assets/images/ControlLand.png";
import cclogo from "@/assets/images/ControlLand2.png";
import { HeaderProps } from "@/interfaces";
import { useAppSelector } from '@/store';

export const Header = ( {children}: HeaderProps) => {
    const { logged } = useAppSelector(store => store.auth);
    return (
        <main className="   tw-mx-auto
                            tw-grid
                            md:tw-grid-cols-2
                            tw-items-center
                            tw-h-screen">
            <div className="tw-border-r md:tw-border-black
                            tw-pr-4 tw-m-6
                            tw-justify-self-end">
                <img src={cclogo} width={350}/>
                {logged ? null :
                <p className="tw-font-montserrat tw-font-bold">
                    Selecciona un usuario en la derecha para comenzar
                </p>
                }
            </div>
            <ul className="tw-pl-3 tw-flex md:tw-flex-col tw-justify-center tw-gap-3">
                {children}
            </ul>
        </main>
    );
}