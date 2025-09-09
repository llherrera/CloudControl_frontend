import React from 'react';
import { Frame } from '@/components/Citizen';
import ManagerCitizenAttention from '@/components/Citizen/ManagerCitizenAttention'; // Import the new component

export const AtencionCiudadanaPage: React.FC = () => {
    return (
        <Frame>
            <div className="tw-w-[90%] tw-m-[5%]">
                <ManagerCitizenAttention />
            </div>
        </Frame>
    );
};