import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Frame } from '@/components';
import {  } from '@/assets/icons';

interface Props {
    title: string;
    desc: string;
    navigate: () => void;
}

export const PQRSPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const navigateForm  = () => navigate('/PQRS/radicar', {replace: true});
    const navigateState = () => navigate('/PQRS/consultar', {replace: true});
    const navigateList  = () => navigate('/PQRS/peticiones', {replace: true});

    const Button = ({title, desc, navigate}: Props) => (
        <button className=' tw-bg-white
                            tw-w-40 tw-p-2
                            tw-rounded
                            tw-flex tw-flex-col
                            tw-justify-between
                            tw-text-left'
                onClick={navigate}>
            <p className='tw-font-bold'>
                {title}
            </p>
            <p className=''>
                {desc}
            </p>
            <span className='tw-rotate-90
                            tw-self-end'>
                ▲
            </span>
        </button>
    );

    return (
        <Frame>
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
                    <Button
                        title='Crea tu petición'
                        desc='Radica tu petición, queja, reclamo, sugerencia o solicitud de información aquí.'
                        navigate={navigateForm}
                    />
                    <Button
                        title='Consulte el estado de su petición'
                        desc='Consulte en que estado está petición, queja, reclamo, sugerencia o solicitud de información aquí.'
                        navigate={navigateState}
                    />
                    <Button
                        title='Ver las peticiones'
                        desc='Revisa las PQRS aquí.'
                        navigate={navigateList}
                    />
                </div>
            </div>
        </Frame>
    );
}
