import React from 'react';
import { Frame } from '@/components/Citizen';
import ManagerCitizenAttention from '@/components/Citizen/ManagerCitizenAttention'; // Import the new component

export const AtencionCiudadanaPage: React.FC = () => {
    return (
        <Frame>
            <h2 className="tw-text-xl tw-font-bold tw-mx-[5%] tw-text-white tw-my-10">Atención Ciudadana</h2>
            <div className="tw-w-[90%] tw-mx-[5%]">
                <ManagerCitizenAttention />
            </div>
        </Frame>
    );
};