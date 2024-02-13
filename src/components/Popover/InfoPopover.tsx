import { useState } from "react";

import InfoIcon from '@mui/icons-material/Info';
import { Popover, ArrowContainer } from 'react-tiny-popover';

export const InfoPopover = () => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Popover
            isOpen={open}
            onClickOutside={handleClose}
            positions={['top', 'bottom', 'left', 'right']}
            content={({ position, childRect, popoverRect }) => (
                <ArrowContainer
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowColor="gray"
                    arrowSize={10}
                    className='popover-arrow-container'
                    arrowClassName='popover-arrow'>
                    <Content/>
                </ArrowContainer>
            )}>
            <button onClick={()=>setOpen(!open)}>
                <InfoIcon color="action"/>
            </button>
        </Popover>
    );
}

const Content = () => {
    return (
        <div className="tw-flex tw-flex-wrap tw-bg-white">
            <p className='  tw-border tw-border-slate-400
                            tw-rounded tw-p-1 tw-text-wrap'>
                Al seleccionar la fecha de corte, será la misma en cada año. <br/> Se bloqueará la opción de subir o actualizar evidencias para el año anterior.
            </p>
        </div>
    );
}