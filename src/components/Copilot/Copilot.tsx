import { useState } from "react";

import InfoIcon from '@mui/icons-material/Info';
import { Popover, ArrowContainer } from 'react-tiny-popover';

export const Copilot = () => {
    return (
        <div className="tw-h-screen tw-m-2">
            <iframe src="https://copilotstudio.microsoft.com/environments/9d3f86e2-d842-eae2-888d-8a70437f8055/bots/creec_cloudI/webchat?__version__=2" 
                className="tw-w-full tw-h-full"></iframe>
        </div>
    );
}

export const CopilotPopover = () => {
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

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
                    <Copilot/>
                </ArrowContainer>
            )}>
            <button type="button"
                title='Chat con copilot'
                className={`tw-transition
                            hover:tw--translate-y-1 hover:tw-scale-[1.4]
                            tw-rounded-full tw-bg-white
                            tw-w-8 tw-h-8 tw-ml-2
                            tw-border-2 tw-border-logoBorder`}
                onClick={()=>setOpen(!open)}>
                AI
            </button>
        </Popover>
    );
}
/*
            <button onClick={()=>setOpen(!open)} type="button">
                <InfoIcon color="action"/>
            </button>
            <button
                title='Chat con copilot'
                className={`tw-transition
                            hover:tw--translate-y-1 hover:tw-scale-[1.4]
                            tw-rounded-full tw-bg-white
                            tw-w-8 tw-h-8 tw-ml-2
                            tw-border-2 tw-border-logoBorder`}
                onClick={()=>navigate('/pdt/PlanIndicativo/copilot')}>
                AI
            </button>
*/