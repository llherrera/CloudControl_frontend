import React from 'react';
import { Frame } from '@/components';
import ManagerCitizenAttention from '@/components/ManagerCitizenAttention'; // Import the new component

export const AtencionCiudadanaPage: React.FC = () => {
    return (
        <Frame>
            <div className="tw-w-[90%] tw-m-[5%]">
                <ManagerCitizenAttention />
            </div>
        </Frame>
    );
};