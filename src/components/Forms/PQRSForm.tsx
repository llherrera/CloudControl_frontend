import { useState, useEffect } from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { useAppSelector } from "@/store";

import { PQRSInform } from '@/interfaces';
import { Solicitante, Peticion, Identificacion, getEnumKeys } from '@/utils';
import { Input, Select, DropdownC } from '@/components';

export const PQRSForm = () => {
    const { id_plan } = useAppSelector(store => store.content);

    const [anonimous, setAnonimous] = useState(false);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [captcha, setCaptcha] = useState(false);
    const [data, setData] = useState<PQRSInform>({
        id_plan: 0,
        tipo_solicitante: '',
        tipo_identificacion: '',
        numero_identificacion: 0,
        razon_social: '',
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        email: '',
        telefono: 0,
        direccion: '',
        barrio: '',
        ciudad: '',
        departamento: '',
        pais: '',
        fecha: new Date(),
        tipo_peticion: '',
        secretaria: '',
        asunto: '',
        peticion: '',
    });
    const [dataSub, setDataSub] = useState<PQRSInform | null>(null);

    useEffect(() => {
        console.log('a', anonimous);
        if (anonimous) {
            setData({
                ...data,
                tipo_solicitante: '',
                tipo_identificacion: '',
                numero_identificacion: 0,
                primer_nombre: '',
                segundo_nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                telefono: 0,
                direccion: '',
                barrio: '',
                ciudad: '',
                departamento: '',
                pais: '',
            });
        } else if (dataSub) {
            setData(dataSub);
        }
    }, [anonimous]);

    const handleAnonimous = (e: React.MouseEvent<HTMLElement>, newValue: boolean) => {
        console.log(newValue);
        setAnonimous(newValue);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | 
                                        HTMLSelectElement | 
                                        HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
        setDataSub(data);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <form 
            action=""
            onSubmit={(e) => handleSubmit(e)}
            className='tw-pb-4'>
            <DropdownC
                title='PASO 1: Datos del Solicitante'>
                <div className='tw-flex tw-justify-center'>
                    <ToggleButtonGroup
                        value={anonimous}
                        exclusive
                        onChange={handleAnonimous}
                        aria-label="text alignment"
                    >
                        <ToggleButton value={true} aria-label="left aligned">
                            A
                        </ToggleButton>
                        <ToggleButton value={false} aria-label="left aligned">
                            N
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                    <Select
                        classname={`tw-col-start-1 tw-col-span-4`}
                        label='Tipo de Solicitante'
                        id='tipo_solicitante'
                        name='tipo_solicitante'
                        value={data.tipo_solicitante}
                        onChange={e => handleInputChange(e)}
                        options={getEnumKeys(Solicitante)}/>
                    <Select
                        classname={`tw-col-start-5 tw-col-span-4`}
                        label='Tipo de Identificación'
                        id='tipo_identificacion'
                        name='tipo_identificacion'
                        value={data.tipo_identificacion}
                        onChange={e => handleInputChange(e)}
                        options={getEnumKeys(Identificacion)}/>
                    <Input
                        classname={`tw-col-start-9 tw-col-span-4`}
                        type={"number"}
                        label="Número de Identificación o NIT:"
                        id="numero_identificacion"
                        name="numero_identificacion"
                        value={data.numero_identificacion}
                        placeholder="Número de identificación"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                    {data.tipo_identificacion === 'NIT' ? <div>
                        <Input
                            classname={``}
                            type={"text"}
                            label="Razón Social:"
                            id="razon_social"
                            name="razon_social"
                            value={data.razon_social}
                            placeholder="Razón Social"
                            onChange={e => handleInputChange(e)}
                            center={true}
                            isRequired/>
                    </div> : <div className='tw-grid'>
                        <Input
                            classname={`tw-col-start-1 tw-col-span-1`}
                            type={"text"}
                            label="Primer Nombre:"
                            id="primer_nombre"
                            name="primer_nombre"
                            value={data.primer_nombre}
                            placeholder="Primer Nombre"
                            onChange={e => handleInputChange(e)}
                            center={true}
                            isRequired/>
                        <Input
                            classname={`tw-col-start-3 tw-col-span-1`}
                            type={"text"}
                            label="Segundo Nombre:"
                            id="segundo_nombre"
                            name="segundo_nombre"
                            value={data.segundo_nombre}
                            placeholder="Segundo Nombre"
                            onChange={e => handleInputChange(e)}
                            center={true}
                            isRequired/>
                        <Input
                            classname={`tw-col-start-1 tw-col-span-1`}
                            type={"text"}
                            label="Primer Apellido:"
                            id="primer_apellido"
                            name="primer_apellido"
                            value={data.primer_apellido}
                            placeholder="Primer Apellido"
                            onChange={e => handleInputChange(e)}
                            center={true}
                            isRequired/>
                        <Input
                            classname={`tw-col-start-3 tw-col-span-1`}
                            type={"text"}
                            label="Segundo Apellido:"
                            id="segundo_apellido"
                            name="segundo_apellido"
                            value={data.segundo_nombre}
                            placeholder="Segundo Apellido"
                            onChange={e => handleInputChange(e)}
                            center={true}
                            isRequired/>
                    </div>
                    }
                    <Input
                        classname={`tw-col-start-9 tw-col-span-2 tw-h-fit`}
                        type={"text"}
                        label="Teléfono:"
                        id="telefono"
                        name="telefono"
                        value={data.telefono}
                        placeholder="Teléfono"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                    <Input
                        classname={`tw-col-start-1`}
                        type={"text"}
                        label="Correo:"
                        id="email"
                        name="email"
                        value={data.email}
                        placeholder="Correo"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                    <Input
                        classname={`tw-col-start-5`}
                        type={"text"}
                        label="Dirección:"
                        id="direccion"
                        name="direccion"
                        value={data.direccion}
                        placeholder="Dirección"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                    <Input
                        classname={`tw-col-start-9`}
                        type={"text"}
                        label="Barrio:"
                        id="barrio"
                        name="barrio"
                        value={data.barrio}
                        placeholder="Barrio"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                    <Input
                        classname={`tw-col-start-1`}
                        type={"text"}
                        label="Ciudad:"
                        id="ciudad"
                        name="ciudad"
                        value={data.ciudad}
                        placeholder="Ciudad"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                    <Input
                        classname={`tw-col-start-5`}
                        type={"text"}
                        label="Departamento:"
                        id="departamento"
                        name="departamento"
                        value={data.departamento}
                        placeholder="Departamento"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                    <Input
                        classname={`tw-col-start-9 tw-ml-3`}
                        type={"text"}
                        label="País:"
                        id="pais"
                        name="pais"
                        value={data.pais}
                        placeholder="País"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                </div>
            </DropdownC>
            <DropdownC
                title='PASO 2: Datos de la solicitud'>
                <div className='tw-grid tw-grid-cols-12 tw-gap-2'>
                    <Input
                        classname={`tw-col-start-1 tw-col-span-2`}
                        type={"text"}
                        label="Asunto:"
                        id="asunto"
                        name="asunto"
                        value={data.asunto}
                        placeholder="Asunto"
                        onChange={e => handleInputChange(e)}
                        center={true}
                        isRequired/>
                    <Select
                        classname={`tw-col-start-6 tw-col-span-4`}
                        label='Tipo de petición'
                        id='tipo_peticion'
                        name='tipo_peticion'
                        value={data.tipo_peticion}
                        onChange={e => handleInputChange(e)}
                        options={getEnumKeys(Peticion)}/>
                    <div className='tw-col-start-1 tw-col-end-13 tw-flex'>
                        <label htmlFor="peticion">Petición:</label>
                        <textarea
                            className=' tw-p-2 tw-ml-2
                                        tw-rounded tw-grow
                                        tw-border-2 tw-border-gray-400
                                        tw-bg-white tw-resize-none'
                            value={data.peticion}
                            name="peticion"
                            id="peticion"/>
                    </div>
                </div>
            </DropdownC>
        </form>
    )
}