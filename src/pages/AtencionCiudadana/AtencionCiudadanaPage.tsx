import React from 'react';
import { Frame } from '@/components';
import ManagerCitizenAttention from '@/components/ManagerCitizenAttention'; // Import the new component

export const AtencionCiudadanaPage: React.FC = () => {
    return (
        <Frame>
            <div style={{ margin: '5% 20%' }}>
                <ManagerCitizenAttention /> {/* Use the new component */}
            </div>
        </Frame>
    );
};