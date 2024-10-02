import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Frame, PQRSButton } from '@/components';

export const PQRSPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const navigateForm  = () => navigate('/PQRS/radicar', {replace: true});
    const navigateState = () => navigate('/PQRS/consultar', {replace: true});
    const navigateList  = () => navigate('/PQRS/peticiones', {replace: true});

    return (
        <Frame>
            {false ? <p>Coming soon</p> :
            <div className='tw-h-screen tw-border'>
                <h1 className=' tw-mx-6 tw-mt-6
                                tw-text-black tw-text-lg
                                tw-font-bold tw-font-montserrat
                                tw-text-center'>
                    <p className='  tw-bg-white tw-p-2
                                    tw-inline-block
                                    tw-rounded'>
                        Atención al cliente
                    </p>
                </h1>
                <div className='tw-flex tw-justify-around tw-my-2'>
                    <PQRSButton
                        title='Crea tu petición'
                        desc='Radica tu petición, queja, reclamo, sugerencia o solicitud de información aquí.'
                        navigate={navigateForm}
                    />
                    <PQRSButton
                        title='Consulte el estado de su petición'
                        desc='Consulte en que estado está petición, queja, reclamo, sugerencia o solicitud de información aquí.'
                        navigate={navigateState}
                    />
                    <PQRSButton
                        title='Ver las peticiones'
                        desc='Revisa las PQRS aquí.'
                        navigate={navigateList}
                    />
                </div>
            </div>
            }
        </Frame>
    );
}
