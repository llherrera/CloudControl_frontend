//import cclogo from "@/assets/images/logo-cc.png";
//import cclogo from "@/assets/images/ControlLand.png";
import cclogo from "@/assets/images/ControlLand2.png";
import { HeaderProps } from "@/interfaces";
import { useAppSelector } from '@/store';

interface HeaderWithPanelProps extends HeaderProps {
    infoPanel?: React.ReactNode;
    columns?: number; // Número de columnas opcional
    rightPanel?: React.ReactNode; // Panel derecho opcional
}

export const Header = ( {children, infoPanel, columns = 2, rightPanel}: HeaderWithPanelProps ) => {
    const { logged } = useAppSelector(store => store.auth);
    // Construir la clase de columnas dinámicamente
    const gridColsClass = `md:tw-grid-cols-${columns}`;
    return (
        <main className={`tw-mx-4 md:tw-mx-auto tw-grid ${gridColsClass} tw-items-center tw-h-[100%]`}>
            <div className="tw-border-r md:tw-border-black
                            tw-p-4 tw-m-6
                            tw-flex tw-justify-center md:tw-justify-center">
                <img src={cclogo} className="tw-w-28 md:tw-w-[220px]" />
            </div>
            <div className="tw-flex tw-flex-row tw-items-center tw-gap-4 tw-justify-center">
                <ul className="tw-pl-3 tw-flex md:tw-flex-col tw-justify-center tw-gap-3">
                    {children}
                </ul>
                {infoPanel && (
                    <div className="tw-ml-2 tw-mt-2">
                        {infoPanel}
                    </div>
                )}
            </div>
            {rightPanel && (
                <div className="tw-flex tw-items-center tw-justify-center">
                    {rightPanel}
                </div>
            )}
        </main>
    );
}