import React, { useState } from 'react';

import { notify } from '@/utils';

import { useAppSelector } from '@/store';

import { uploadLogoPlan, uploadLogoCity } from '@/services/api';
import { LoadIcon, Spinner } from '@/assets/icons';

export const UploadLogoCity = () => {
    const { id_plan } = useAppSelector(store => store.content);

    const [logoPlan, setLogoPlan] = useState<FileList | null>(null);
    const [logoPlanStr, setLogoPlanStr] = useState<string | null>(null);
    const [load, setLoad] = useState<boolean>(false);
    const types = ['image/png', 'image/jpeg'];

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const file = e.target.files;
        if (file) {
            if (file.length > 1) {
                notify('Solo se puede subir un archivo');
                return;
            }
            if (types.includes(file[0].type) === false) {
                notify('El archivo tiene que ser PNG o JPG');
                return;
            }
            reader.onloadend = () => {
                if (logoPlan === null) {
                    setLogoPlanStr(reader.result as string);
                    setLogoPlan(file);
                }
            }
            reader.readAsDataURL(file[0]);
        }
    };

    const handleSaveLogo = async () => {
        if (logoPlan === null || logoPlan.length === 0) {
            notify('No hay archivo');
            return;
        }
        setLoad(true);
        await uploadLogoCity(id_plan, logoPlan[0])
        .then(() => {
            notify('Logo subido');
            setLoad(false);
        })
        .catch((err) => {
            console.log(err);
            notify('error al subir logo');
            setLoad(false);
        });
    };

    
    return (
        <form   id='logoForm'
                encType='multipart/form-data'
                className=' tw-mt-2 tw-ml-2'>
            <div className='tw-flex tw-justify-center tw-gap-4'>
                {load ? 
                    <div>
                        <Spinner/>
                        <p className='tw-text-[#222222] 
                                        tw-font-bold tw-text-lg 
                                        tw-font-montserrat'>
                            Cargando Evidencia...
                        </p>
                    </div> : 
                    <div>
                    {logoPlan === null ?
                        <label>
                            Cargar logo del municipio
                            <LoadIcon/>
                        </label>:
                        <img    
                        src={logoPlanStr!}
                        alt="Uploaded"
                        style={{ width: '200px' }}
                        className='tw-mb-2'/>
                    }
                    </div>
                }
            </div>
            <div className='tw-flex tw-justify-center'>
                <input  
                    type='file'
                    onChange={handleUpload}/>
            </div>
            <div className='tw-flex tw-justify-center'>
                <button
                    type='button'
                    className=' tw-bg-greenColory hover:tw-bg-green-400 
                                tw-text-white hover:tw-text-black 
                                tw-font-bold tw-text-center
                                tw-p-2 tw-mt-2 tw-rounded'
                    onClick={handleSaveLogo}>
                    Guardar
                </button>
            </div>
        </form>
    );
}

export const UploadLogoPlan = () => {
    const { id_plan } = useAppSelector(store => store.content);

    const [logoPlan, setLogoPlan] = useState<FileList | null>(null);
    const [logoPlanStr, setLogoPlanStr] = useState<string | null>(null);
    const [load, setLoad] = useState<boolean>(false);
    const types = ['image/png', 'image/jpeg'];

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const file = e.target.files;
        if (file) {
            if (file.length > 1) {
                return notify('Solo se puede subir un archivo');
            }
            if (types.includes(file[0].type) === false) {
                return notify('El archivo tiene que ser PNG o JPG');
            }
            reader.onloadend = () => {
                if (logoPlan === null) {
                    setLogoPlanStr(reader.result as string);
                    setLogoPlan(file);
                }
            }
            reader.readAsDataURL(file[0]);
        }
    };

    const handleSaveLogo = async () => {
        if (logoPlan === null || logoPlan.length === 0) {
            notify('No hay archivo');
            return;
        }
        setLoad(true);
        await uploadLogoPlan( id_plan, logoPlan[0])
        .then(() => {
            notify('Logo subido');
            setLoad(false);
        })
        .catch((err) => {
            console.log(err);
            notify('error al subir logo');
            setLoad(false);
        });
    };

    
    return (
        <form   id='logoForm'
                encType='multipart/form-data'
                className=' tw-mt-2 tw-ml-2'>
            <div className='tw-flex tw-justify-center tw-gap-4'>
                {load ? 
                    <div>
                        <Spinner/>
                        <p className='tw-text-[#222222] 
                                        tw-font-bold tw-text-lg 
                                        tw-font-montserrat'>
                            Cargando Evidencia...
                        </p>
                    </div> :
                    <div>
                    {logoPlan === null ?
                        <label>
                            Cargar logo del municipio
                            <LoadIcon/>
                        </label>:
                        <img    
                        src={logoPlanStr!}
                        alt="Uploaded"
                        style={{ width: '200px' }}
                        className='tw-mb-2'/>
                    }
                    </div>
                }
            </div>
            <div className='tw-flex tw-justify-center'>
                <input  
                    type='file'
                    onChange={handleUpload}/>
            </div>
            <div className='tw-flex tw-justify-center'>
                <button
                    type='button'
                    className=' tw-bg-greenColory hover:tw-bg-green-400 
                                tw-text-white hover:tw-text-black 
                                tw-font-bold tw-text-center
                                tw-p-2 tw-mt-2 tw-rounded'
                    onClick={handleSaveLogo}>
                    Guardar
                </button>
            </div>
        </form>
    );
}