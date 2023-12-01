import React, { useCallback, useState } from 'react'
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';

import { uploadLogoPlan } from '@/services/api';
import { LoadIcon } from '@/assets/icons';

export const UploadImage = ( {id}:{id:number} ) => {

    const [logo, setLogo] = useState<File | null>(null)

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        const file = acceptedFiles[0];
        if(file.type === 'image/png' ||
            file.type === 'image/jpeg' || 
            file.type === 'image/jpg') {
            setLogo(file)
        }
        else {
            alert('Archivo incorrecto')
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleSaveLogo = async () => {
        if (logo === null) {
            alert('No hay archivo')
            return
        }
        await uploadLogoPlan( id, logo)
        .then(() => {
            alert('Logo subido')
        })
        .catch((err) => {
            console.log(err);
            alert('error al subir logo')
        })
    }

    return (
        <form   id='logoForm'
                encType='multipart/form-data'
                onSubmit={handleSaveLogo}
                className=' tw-mt-2 tw-ml-2'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <div>
                        <p className='tw-text-center'>Guardar logo</p>
                        <div className='tw-flex tw-justify-center'>
                            <LoadIcon/>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className='tw-text-center'>Cargar logo</p>
                        <div className='tw-flex tw-justify-center'>
                            <LoadIcon/>
                        </div>
                    </div>
                )}
                <div className='tw-flex tw-justify-center'>
                    <button className='tw-bg-greenBtn hover:tw-bg-green-400 
                                        tw-text-white hover:tw-text-black tw-font-bold
                                        tw-p-2 tw-rounded'>
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    )
}