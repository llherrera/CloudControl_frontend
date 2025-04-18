import { useState, useEffect } from 'react';

import {useAppSelector, useAppDispatch } from '@/store';
import {
    thunkAddProjects,
    thunkUpdateProjects } from '@/store/plan/thunks';

import { Box, Button, CircularProgress } from '@mui/material';

import { Project, PropsCallback } from '@/interfaces';
import { notify } from "@/utils";

export const ProjectForm = ({callback}: PropsCallback) => {
    const dispatch = useAppDispatch();

    const { years, secretaries, loadingProjects
    } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [projectsF, setProjectsF] = useState<Project[]>([{
        id_project: 0,
        BPIM: 0,
        entity: '',
        name: '',
        year: 0,
        link: ''
    }]);
    const [files, setFiles] = useState<(File | null)[]>([null]);

    const addProject = () => {
        const newData = [...projectsF, { id_project: 0, BPIM: 0, entity: '', name: '', year: 0, link: '' }];
        setProjectsF(newData);
        setFiles([...files, null]);
    };

    const deleteProject = () => {
        const newData = projectsF.slice(0, -1);
        const newFiles = files.slice(0, -1);
        setProjectsF(newData);
        setFiles(newFiles);
    };

    const handleInputChange = (event: React.ChangeEvent<
                                        HTMLInputElement |
                                        HTMLSelectElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...projectsF];
        newData[index] = { ...newData[index], [name]: value };
        setProjectsF(newData);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedFiles = [...files];
        updatedFiles[index] = event.target.files ? event.target.files[0] : null;
        setFiles(updatedFiles);
    };

    const handleSubmit = async () => {
        let valid = true;
        projectsF.forEach((p, i) => {
            if (p.name === "" || p.BPIM === 0 || p.year === 0 || p.entity === '' || files[i] === null){
                valid = false;
                return notify("Por favor llene todos los campos", 'warning');
            }
        })
        if (valid) {
            for (let i = 0; i < projectsF.length; i++) {
                await dispatch(thunkAddProjects({ id_plan: id_plan, project: projectsF[i], file: files[i]! }));
            }
            //notify('Se ha agregado correctamente', 'success');
            callback(false);
        }
    };

    return (
    <form className="tw-p-2 tw-my-2 tw-bg-white"
        encType="multipart/form-data">
        <p className="tw-font-bold tw-text-center">
            Añadir proyectos
        </p>
        {projectsF.map((p, index) =>
            <div key={index}
                className='tw-flex tw-flex-wrap tw-p-1 tw-rounded'>
                <label className='tw-mr-2'>{projectsF.length > 9 && index < 9 ? 0 : null}{index + 1}</label>
                <div className='tw-flex tw-flex-col'>
                    <label>Nombre del proyecto</label>
                    <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                            onChange={ (e) => handleInputChange(e, index) } value={ p.name}
                            type="text" name="name" required placeholder="Nombre del proyecto" />
                </div>
                <div className='tw-flex tw-flex-col'>
                    <label>Código BPIM</label>
                    <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                        onChange={ (e) => handleInputChange(e, index) } value={ p.BPIM}
                        type="number" name="BPIM" required placeholder="Código BPIM" />
                </div>
                <div className='tw-flex tw-flex-col'>
                    <label>Secretaría</label>
                    <select className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400 tw-w-32"
                        name="entity" onChange={(e) => handleInputChange(e, index)} value={p.entity}>
                        <option value="">Seleccionar Entidad</option>
                        {secretaries && secretaries.map(s => <option key={s.id_secretary} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
                <div className='tw-flex tw-flex-col'>
                    <label>Año</label>
                    <select className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400 tw-w-32"
                            name="year" onChange={(e) => handleInputChange(e, index)} value={p.year}>
                        <option value="0">Año</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className='tw-flex tw-flex-col'>
                    <label>Archivo</label>
                    <input  className={`tw-m-2 tw-p-2 tw-w-32 tw-rounded tw-border-2 ${files[index] !== null ? 'tw-border-green-400' : 'tw-border-gray-400'} `}
                        onChange={e => handleFileChange(e, index) }
                        type="file" name="file" required placeholder="Enlace" />
                </div>
            </div>
        )}
        <div className="tw-flex tw-justify-around tw-py-2 tw-rounded">
            <button className=" tw-bg-green-500
                                hover:tw-bg-green-300 
                                tw-text-white tw-font-bold          
                                tw-w-12 tw-p-2 tw-rounded"
                    type="button"
                    title="Agregar un nuevo nivel"
                    onClick={ addProject }>+</button>
            <button className=" tw-bg-red-500 
                                hover:tw-bg-red-300 
                                tw-text-white tw-font-bold
                                tw-w-12 tw-p-2 tw-rounded"
                    type="button"
                    title="Eliminar un nivel"
                    onClick={ deleteProject }>-</button>
        </div>
        <div className="tw-flex tw-justify-center">
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                {loadingProjects ?
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box> :
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Guardar
                </Button>
                }
            </Box>
        </div>
    </form>);
}