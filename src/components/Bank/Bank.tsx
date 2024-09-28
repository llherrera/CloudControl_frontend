import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { ProjectList } from "./ProjectList";

import { useAppDispatch, useAppSelector } from "@/store";
import { setProjectPage, setIsFullHeight } from "@/store/content/contentSlice";

import { Check, Gavel, CloudDownload } from '@mui/icons-material';

import { DrawerMenu, ListItemComp, BackBtn,
    DropdownC } from '@/components';
import { getCountProjectsByPlan } from "@/services/api";
import { getEnvironment } from "@/utils";

const colorIcon = '#049cdb';
const { URL_FILES } = getEnvironment();

export const Bank = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const { id_plan, projectPage } = useAppSelector(store => store.content);

    const [title, setTitle] = useState("Proyectos");

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkHeight = () => {
            if (contentRef.current) {
                dispatch(setIsFullHeight(contentRef.current.scrollHeight <= window.innerHeight * 0.8));
            }
        };

        checkHeight();
        window.addEventListener('resize', checkHeight);

        return () => {
            window.removeEventListener('resize', checkHeight);
        };
    }, [projectPage]);

    const handleBack = () => navigate(-1);
    const handlePage = (page: number) => dispatch(setProjectPage(page));
    const handleTitle = (title: string) => setTitle(title);

    return(
        <div ref={contentRef}>
            <div>
                <DrawerMenu height={'80%'}>
                    <ListItemComp
                        page={projectPage}
                        index={0}
                        setPage={() => handlePage(0)}
                        setTitle={() => handleTitle('Banco de Proyectos')}
                        title='Banco de Proyectos'/>
                    <ListItemComp
                        page={projectPage}
                        index={1}
                        setPage={() => handlePage(1)}
                        setTitle={() => handleTitle('Documentos Técnicos')}
                        title='Documentos Técnicos'/>
                    <ListItemComp
                        page={projectPage}
                        index={2}
                        setPage={() => handlePage(2)}
                        setTitle={() => handleTitle('Marco Legal y Normativo')}
                        title='Marco Legal y Normativo'/>
                    <ListItemComp
                        page={projectPage}
                        index={3}
                        setPage={() => handlePage(3)}
                        setTitle={() => handleTitle('MGA WEB')}
                        title='MGA WEB'/>
                    <ListItemComp
                        page={projectPage}
                        index={4}
                        setPage={() => handlePage(4)}
                        setTitle={() => handleTitle('Presentación de Proyectos')}
                        title='Presentación de Proyectos'/>
                    <ListItemComp
                        page={projectPage}
                        index={5}
                        setPage={() => handlePage(5)}
                        setTitle={() => handleTitle('Proyectos')}
                        title='Proyectos'/>
                </DrawerMenu>
            </div>
            <div className="sm:tw-ml-2 md:tw-ml-40 tw-mr-2 xl:tw-ml-40
                    tw-mt-24 md:tw-mt-0">
                <div className="tw-flex tw-justify-between tw-mt-1">
                    <BackBtn handle={handleBack} id={id_plan}/>
                    <p className="tw-bg-white tw-mb-1 tw-rounded tw-p-1 tw-font-bold">{title}</p>
                    <div></div>
                </div>
                {projectPage === 0 ? <InfoPage/> :
                projectPage === 1 ? <DocsPage/> :
                projectPage === 2 ? <RulesPage/> :
                projectPage === 3 ? <MGAWEB/> :
                projectPage === 4 ? <PresentationPage/> :
                <ProjectList/> }
            </div>
        </div>
    );
}

const InfoPage = () => {
    const { id_plan } = useAppSelector(store => store.content);
    const { years } = useAppSelector(store => store.plan);
    const [count, setCount] = useState<number[]>(years.map(y => 0));

    useEffect(() => {
        getCountProjectsByPlan(id_plan)
        .then((res:{count:number, year:number}[]) => {
            setCount(years.map(y => res.find(e => e.year === y)?.count ?? 0))
        });
    }, []);

    return (
        <div className='tw-bg-white tw-mx-4 tw-p-2 tw-mb-4 tw-rounded'>
            <section className="tw-mx-4 tw-text-justify">
                <h1 className="tw-text-center tw-font-bold tw-text-2xl">Banco de Programas y Proyectos de Inversión</h1><br />
                <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/cloudcontrol-51ebb.appspot.com/o/Images%2Fimgbgbancoproy.png?alt=media"
                        width={400}
                        className="tw-m-auto tw-block tw-shadow-xl"/> <br />
                    <p>
                        Banco de Proyectos de Inversión – BPI es una herramienta que apoya el ciclo de la inversión pública, de tal forma que se logre la asignación eficiente de recursos y el fortalecimiento de la programación integral, el seguimiento y la evaluación de la inversión pública. El BPI debe desarrollar cuatro componentes: legal e institucional, metodológico y conceptual, de herramientas informáticas y de capacitación y asistencia técnica.
                    </p>
                </div><br />
                <div>
                    <h3 className="tw-font-bold tw-text-xl tw-indent-4">
                        Objetivos del Banco de Proyectos de Inversión – BPI de la entidad territorial
                    </h3>
                    <p>
                        El objetivo general y los objetivos específicos del BPI, así como sus impactos sobre la inversión pública, transcienden la disponibilidad de información básica sobre los proyectos. Por lo tanto, resulta de vital importancia definir el alcance y los impactos, pues estos se convierten en las metas que trazan la gestión de la inversión pública, tal y como como se muestra en el siguiente gráfico:
                    </p>
                </div><br />
                <div>
                    <h3 className="tw-font-bold tw-text-xl tw-indent-4">
                        Árbol de objetivos de los bancos de programas y proyectos territoriales
                    </h3><br />
                    <img src="https://firebasestorage.googleapis.com/v0/b/cloudcontrol-51ebb.appspot.com/o/Images%2Farbolbancoproy.png?alt=media"
                        width={500}
                        className="tw-m-auto tw-block tw-shadow-2xl"/> <br />
                </div>
                <div>
                    <h1 className="tw-font-bold tw-text-xl">Gestión BPIM</h1>
                    <div className="tw-border tw-rounded
                                    tw-px-4 tw-py-2">
                        <h1 className="tw-font-bold tw-text-xl">
                            Revisión y evaluación de proyectos de inversión para ser registrados en el BPIM
                        </h1><br />
                        <p>
                            El proceso de viabilidad y registro de proyectos al BPIM se realizó con base a la directriz emitida por el DNP en su resolución Nro. 4788 “Por la cual se dictan los lineamientos para el registro de la información de inversión pública de las entidades territoriales”, por medio de la cual se determinó la utilización de la herramienta de registro de los proyectos de inversión en el Sistema Único de Inversiones y Finanzas Públicas (SUIFP), el cual será el banco único de proyectos donde se viabilizan y registran los proyectos de inversión conforme a los procesos y procedimientos determinados por el DNP.
                        </p><br />
                        <p>    
                            De igual forma el DNP a determinado directrices, procesos, lineamientos, requisitos, requerimientos, metodología y criterios para la estructuración presentación de proyectos de inversión ante el Banco de Proyectos tanto nacional como el ámbito Territorial, los cuales el municipio de Ibagué cumple plenamente.
                        </p><br />
                        <p>
                            El Banco de Programas y Proyectos de Inversión Municipal – BPIM desarrolla entre sus actividades la asesoría y asistencia técnica en la formulación, seguimiento y evaluación de cada uno de los proyectos que han sido radicados y presentados ante el BPIM; estas revisiones se han realizado con base en las listas de verificación de requisitos para presentar proyectos de inversión susceptibles de ser financiados con recursos públicos con base a las Leyes 2056 del 2020 y 1082 del 2015 según la naturaleza del proyecto emitido por el DNP.
                        </p><br />
                        <p>
                            En el proceso de revisión y evaluación de proyectos presentados al BPIM se llevaron a cabo diversas mesas de trabajo con las diferentes secretarias con el fin de realizar los ajustes pertinentes, para luego continuar el proceso de viabilización y registro en el BPIM.
                        </p>
                    </div>
                    <div>
                        {years.map((y, i) =>
                            <DropdownC
                                m='mt-1'
                                bg="blueColory"
                                textColor="white"
                                title={`Proyectos viabilizados y registrados en la vigencia ${y}`}>
                                <p className="tw-text-center tw-font-bold">PROYECTOS VIABILIZADOS</p>
                                <p className="tw-text-center tw-font-bold">{count[i]}</p>
                            </DropdownC>
                        )}
                    </div>
                    <div className="tw-border tw-rounded
                                    tw-px-4 tw-py-2">
                        <h1 className="tw-font-bold tw-text-xl">
                            Actualización base de datos BPIM
                        </h1><br />
                        <p>
                            El BPIM entre sus funciones se encuentra el mantener actualizado el sistema información contenida en cada proyecto de inversión tanto digital como física, por tal razón podemos decir que a la fecha se encuentran actualizadas la plataforma MGA WEB, SUIFP y SPI.
                        </p>
                    </div>
                    <div className="tw-border tw-rounded
                                    tw-px-4 tw-py-2">
                        <h1 className="tw-font-bold tw-text-xl">
                            Seguimiento de proyectos
                        </h1><br />
                        <p>
                            El proceso descriptivo, que se realiza durante la etapa de ejecución de la intervención pública (programa o proyecto), mediante el cual se recolecta, procesa y registra la información de ejecución, comparándola con lo planificado en la formulación, para identificar las desviaciones, fortalezas y debilidades de ésta, y así introducir cambios que lleven a mejores niveles de ejecución y a un cumplimiento óptimo de sus objetivos.
                        </p>
                    </div>
                    <div className="tw-border tw-rounded
                                    tw-px-4 tw-py-2">
                        <h1 className="tw-font-bold tw-text-xl">
                            Sistema de Seguimiento a Proyectos de Inversión – SPI
                        </h1><br />
                        <p>
                            Es una herramienta que:
                        </p><br />
                        <ul className="tw-pl-8 tw-list-disc">
                            <li>
                                Facilita la recolección y análisis continuo de información para identificar y valorar los posibles problemas y logros frente a los mismos.
                            </li><br />
                            <li>
                                Constituye la base para la adopción de medidas correctoras con el fin de mejorar el diseño, aplicación y calidad de los proyectos de inversión.
                            </li><br />
                            <li>
                                Permite tomar decisiones durante la implementación del proyecto, mediante una comparación entre los resultados esperados y el avance de los mismos.
                            </li><br />
                            <li>
                                Es un Componente de Seguimiento del SUIFP, a través del cual se determina el avance en la ejecución de los proyectos.
                            </li><br />
                            <li>
                                Facilita el control de la ejecución y la preparación de los reportes – Mostrar resultados.
                            </li><br />
                            <li>
                                Explica a los demás lo que sucede y por qué se logran o no los resultados esperados – Apoyar los procesos de transparencia.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

const DocsPage = () => {
    return (
        <div className='tw-bg-white tw-mx-4 tw-p-2 tw-mb-4 tw-rounded tw-text-justify'>
            <img src={`${URL_FILES}Images%2Fimgbgdocs.png?alt=media`}
                width={400}
                className="tw-m-auto tw-mt-4 tw-block tw-shadow-xl"/> <br />
            <ul className="tw-m-2">
                <div className="tw-flex tw-gap-5 tw-pb-5 tw-border-b">
                    <div>
                        <h1 className="tw-font-bold tw-text-xl">
                            <Check sx={{ color: colorIcon }}/>
                            ABC de la Viabilidad
                        </h1>
                        <p className="tw-font-bold">Criterios para dar viabilidad a un proyecto de inversión pública</p>
                        <p>
                            El presente documento tiene por objetivo desarrollar elementos técnicos y conceptuales básicos del proceso de viabilidad de los proyectos de inversión pública en Colombia, independientemente de su fuente de financiación, de tal forma que la sociedad pueda contar con proyectos que obedezcan a criterios estandarizados desde el punto de vista metodológico, técnico, y de articulación con la política pública.
                        </p>
                    </div>
                    <a  href="https://cimpp.ibague.gov.co/wp-content/uploads/2019/11/1-ABC-de-la-viabilidad.pdf"
                        target="_blank">
                        <img src={`${URL_FILES}Images%2Fimgabc.PNG?alt=media`}
                            alt="image_abc"
                            className="tw-shadow-2xl"
                            width={800}
                        />
                    </a>
                </div><br />
                <div className="tw-flex tw-gap-5 tw-pb-5 tw-border-b">
                    <div>
                        <h1 className="tw-font-bold tw-text-xl">
                            <Check sx={{ color: colorIcon }}/>
                            Cartilla Orientadora
                        </h1>
                        <p className="tw-font-bold">Cartilla Orientadora Puesta en Marcha y Gestión de los Bancos de Programas y Proyectos Territoriales</p>
                        <p>
                            Este documento presenta los lineamientos legales, conceptuales y metodológicos que permiten la consolidación de la Red Nacional de Programas y Proyectos, entendiendo esta herramienta como un valioso instrumento para optimizar el ciclo de la inversión pública, particularmente en el marco de la Inversión Orientada a Resultados.
                        </p>
                    </div>
                    <a  href="https://cimpp.ibague.gov.co/wp-content/uploads/2019/11/2-Cartilla-BPI.pdf"
                        target="_blank">
                        <img src={`${URL_FILES}Images%2Fimgcartilla.PNG?alt=media`}
                            alt="image_cartilla"
                            className="tw-shadow-2xl"
                            width={650}
                        />
                    </a>
                </div><br />
                <div className="tw-flex tw-gap-5 tw-pb-5 tw-border-b">
                    <div>
                        <h1 className="tw-font-bold tw-text-xl">
                            <Check sx={{ color: colorIcon }}/>
                            Manual funcional del Sistema Unificado de Inversiones y Finanzas Publicas (SUIFP)
                        </h1>
                        <p>
                            Este manual presenta los procedimientos para el registro de información de los proyectos de inversión pública, en el Sistema Unificado de Inversiones y Finanzas Públicas (SUIFP).A través de esta, se realizará el ingreso de la información mínima requerida en los proyectos de inversión y se soportarán los procesos para gestionar el proyecto en sus etapas de formulación, presentación, viabilidad, ejecución, incluyendo su seguimiento y evaluación.
                        </p>
                    </div>
                    <a  href="https://cimpp.ibague.gov.co/wp-content/uploads/2018/08/Manual-funcional-SUIFP.pdf"
                        target="_blank">
                        <img src={`${URL_FILES}Images%2Fimgsuifp.PNG?alt=media`}
                            alt="image_suifp"
                            className="tw-shadow-2xl"
                            width={800}
                        />
                    </a>
                </div><br />
                <div className="tw-flex tw-flex-col">
                    <div className="tw-flex tw-gap-5">
                        <div>
                            <h1 className="tw-font-bold tw-text-xl">
                                <Check sx={{ color: colorIcon }}/>
                                Seguimiento a proyectos de inversión
                            </h1><br />
                            <p className="tw-font-bold">Presentación Conceptual Seguimiento</p>
                            <p>
                                El seguimiento a la inversión pública busca describir si el Estado está produciendo y entregando los bienes y servicios públicos de acuerdo con una programación estimada y unos recursos asignados para dicho propósito. Además, apoya los procesos de evaluación para determinar si dichos bienes y servicios contribuyen a los cierres de brechas y a la estabilidad económica.
                            </p>
                        </div>
                        <a  href="https://cimpp.ibague.gov.co/wp-content/uploads/2022/09/Presentacion-Conceptual-Seguimiento-V22.pdf"
                            target="_blank">
                            <img src={`${URL_FILES}Images%2Fimgpresentacion.PNG?alt=media`}
                                alt="image_presentation"
                                className="tw-shadow-2xl"
                                width={650}
                            />
                        </a>
                    </div><br />
                    <div className="tw-flex tw-gap-5">
                        <div>
                            <p className="tw-font-bold">Guía de Registro de Seguimiento Mensual</p>
                            <p>
                                El Sistema de Seguimiento de Proyectos de Inversión – SPI creado a través del decreto 3286 de 2004, es una herramienta que facilita la recolección y análisis continúo de información para identificar y valorar los posibles problemas y logros frente a los mismos. Además, constituye la base para la adopción de medidas correctoras para: mejorar el diseño, aplicación y calidad de los resultados obtenidos y tomar decisiones durante la implementación de una política, programa o proyecto, con base en una comparación entre los resultados esperados y el estado de avance de los mismos en materia de ejecución financiera, física y de gestión de los recursos.
                            </p>
                        </div>
                        <a  href="https://cimpp.ibague.gov.co/wp-content/uploads/2022/09/Guia-de-Registro-de-Seguimiento-Mensual-2018-25.pdf"
                            target="_blank">
                            <img src={`${URL_FILES}Images%2Fimgguia.PNG?alt=media`}
                                alt="image_guide"
                                className="tw-shadow-2xl"
                                width={950}
                            />
                        </a>
                    </div>
                </div>
            </ul><br /><br />
            <p className="tw-font-bold">
                **La información que se suministre sobre los avances que el proyecto obtiene durante la vigencia presupuestal será responsabilidad de la entidad ejecutora del mismo.
            </p><br />
            <p className="tw-font-bold">
                **Reportes de seguimiento a los proyectos de inversión: Las entidades ejecutoras deberán reportar mensualmente al sistema que administra el Departamento Nacional de Planeación el avance logrado por el proyecto durante ese período
            </p>
        </div>
    );
}

const RulesPage = () => {
    return (
        <div className='tw-bg-white tw-mx-4 tw-p-2 tw-mb-4 tw-rounded tw-text-justify'>
            <img src={`${URL_FILES}Images%2Fimgbgnormativa.png?alt=media`}
                width={600}
                className="tw-m-auto tw-mt-4 tw-block tw-shadow-xl"/> <br />
            <p className="tw-mx-2">
                El marco legal que rige para los Bancos de Programas y Proyectos, se presenta en función a cinco criterios claves en el ciclo de la inversión pública: la planeación como soporte de la inversión pública; las herramientas de planificación; el seguimiento y evaluación de la inversión pública; la integración de la planeación y el sistema presupuestal; y la transparencia y participación ciudadana, criterios que soportan la creación y puesta en marcha de los Bancos de Programas y Proyectos Territoriales y por ende se configuran en la parte considerativa jurídica del acto administrativo de creación del Banco.
            </p><br />
            <div className="tw-mx-2">
                <h1 className="tw-font-bold tw-text-xl">
                    <Gavel sx={{ color: colorIcon }}/>
                    Normatividad Nacional
                </h1>
                <a  href={'https://cimpp.ibague.gov.co/wp-content/uploads/2017/11/RESOLUCION-4788-2016.pdf'}
                    target="_blank"
                    className="tw-font-bold tw-italic tw-text-hoverBlueBar">
                    Resolución 4788 de Diciembre de 2016
                </a>
                <p>"Por la cual se dictan los lineamientos para el registro de la información de inversión pública de las entidades territoriales".</p>
            </div><br />
            <div className="tw-mx-2">
                <h1 className="tw-font-bold tw-text-xl">
                    <Gavel sx={{ color: colorIcon }}/>
                    Normatividad Municipal
                </h1>
                <a  href={'https://cimpp.ibague.gov.co/wp-content/uploads/2017/11/Decreto-0867-del-27-de-Septiembre-de-2017.pdf'}
                    target="_blank"
                    className="tw-font-bold tw-italic tw-text-hoverBlueBar">
                    Decreto 0867 del 27 de Septiembre de 2017
                </a>
                <p>“Por medio de la cual se actualiza el Banco de Programas y Proyectos de Inversión del Municipio de Ibagué, se adoptan los manuales y metodología y se dictan otras disposiciones”.</p>
            </div><br />
        </div>
    );
}

const MGAWEB = () => {
    return (
        <div className='tw-bg-white tw-mx-4 tw-p-2 tw-mb-4 tw-rounded tw-text-justify'>
            <img src={`${URL_FILES}Images%2Fimgbgmgaweb.png?alt=media`}
                width={600}
                className="tw-m-auto tw-mt-4 tw-block tw-shadow-xl"/> <br />
            <div className="tw-mx-4">
                <p>
                    La Metodología General Ajustada (MGA WEB) es una aplicación informática que sigue un orden lógico para el registro de la información más relevante resultado del proceso de formulación y estructuración de los proyectos de inversión pública. Su sustento conceptual se basa de una parte en la metodología de Marco Lógico y de otra en los principios de preparación y evaluación económica de proyectos.
                </p><br />
                <p>
                    La Metodología General Ajustada web recibe este nombre porque cumple con tres condiciones: En primer lugar, se estructura como metodología, dado que presenta una secuencia ordenada de formularios que se integran de manera sistemática para facilitar la toma de decisiones y la gestión de los proyectos de inversión pública. En segundo lugar, es general en el sentido que está concebida para registrar cualquier iniciativa de inversión pública, independientemente de la fase en la que esta se encuentre, del sector al que pertenezca y de las fuentes de financiación tratándose por supuesto del presupuesto de inversión pública. Por último, por ajustada se entiende que ha venido evolucionando en el tiempo. Aunque se tienen antecedentes desde 1989, es especialmente a partir de 2003 que se desarrolla como aplicación informática experimentando modificaciones tanto en la composición de los formularios como en los sistemas operativos utilizados para su funcionamiento.
                </p><br />
                <p>
                    La MGA está compuesta por módulos y capítulos organizados de manera secuencial para que el usuario registre progresivamente la información obtenida y trabajada en el proceso de formulación. Contempla desde el momento en que se identifica una situación negativa experimentada por un determinado grupo de personas y una o más alternativas de solución, hasta la evaluación de la viabilidad técnica, social, ambiental y económica de cada una de dichas alternativas; lo cual permite elegir la más conveniente y programar el cumplimiento del objetivo general propuesto en términos de indicadores y metas.
                </p><br />
                <div className="tw-flex tw-flex-col tw-pb-4 tw-border-b-4 tw-border-hoverBlueBar">
                    <h1 className="tw-font-bold tw-text-xl">Guía de apoyo para la formulación de proyectos de inversión pública y diligenciamiento de la MGA</h1>
                    <a href="https://cimpp.ibague.gov.co/wp-content/uploads/2017/12/Guia-apoyo-formulacion-proyectos.pdf"
                        target="_blank"
                        className="tw-m-auto tw-block">
                        <img src={`${URL_FILES}Images%2Fimgguiaapoyo.PNG?alt=media`}
                            width={400}
                            className=" tw-shadow-xl"/> 
                    </a>
                </div><br />
                <div>
                    <h1 className="tw-font-bold tw-text-xl">Lo invitamos a conocer la Plataforma</h1>
                    <a href="https://sts.dnp.gov.co/login.aspx?ReturnUrl=%2f%3fwa%3dwsignin1.0%26wtrealm%3dhttps%253a%252f%252fmgaweb.dnp.gov.co%252f%26wctx%3drm%253d0%2526id%253dpassive%2526ru%253d%25252f%26wct%3d2024-08-27T17%253a01%253a12Z&wa=wsignin1.0&wtrealm=https%3a%2f%2fmgaweb.dnp.gov.co%2f&wctx=rm%3d0%26id%3dpassive%26ru%3d%252f&wct=2024-08-27T17%3a01%3a12Z"
                        target="_blank">
                        <img src={`${URL_FILES}Images%2Flogomga.png?alt=media`}
                            width={300}
                            className="tw-m-auto tw-block tw-shadow-xl"/> 
                    </a>
                </div><br />
            </div>
        </div>
    );
}

const PresentationPage = () => {
    return (
        <div className='tw-bg-white tw-mx-4 tw-p-2 tw-mb-4 tw-rounded tw-text-justify'>
            <img src={`${URL_FILES}Images%2Fimgbgpresentacion.png?alt=media`}
                width={400}
                className="tw-m-auto tw-mt-4 tw-block tw-shadow-xl"/><br/>
            <div className="tw-mx-4">
                <h1 className="tw-text-hoverBlueBar tw-text-2xl tw-font-bold tw-shadow">
                    Paso a paso para la presentación de proyectos de inversión
                </h1><br/>
                <img src={`${URL_FILES}Images%2Fpasospresentacion.png?alt=media`}
                    width={600}
                    className="tw-m-auto tw-block tw-shadow-xl"/><br/>
                <p className="tw-font-bold tw-italic">
                    Guía de apoyo para la formulación de proyectos de inversión pública y diligenciamiento de la MGA
                </p><br />
                <div className="tw-flex tw-justify-center">
                    <a  className=" tw-bg-blueColory tw-text-white
                                    tw-py-4 tw-px-6 tw-m-auto
                                    tw-block tw-rounded tw-shadow"
                        href={`${URL_FILES}Files%2FGuia-apoyo-formulacion-proyectos.pdf?alt=media`}
                        download={'Guia-apoyo-formulacion-proyectos.pdf'}>
                        <CloudDownload sx={{ color: '#FFFFFF' }}/>
                        Descargar guía de apoyo para la formulación
                    </a>
                </div><br/>
                <p className="tw-font-bold tw-text-xl">
                    Lo invitamos a ver el listado de verificación de requisitos
                </p><br />
                <p>
                    Los siguientes archivos corresponden al listado de verificación de requisitos para la viabilización de proyectos de inversión pública; los cuales brindan información ampliada y pertinente sobre los requisitos mínimos generales solicitados para la presentación de proyectos de inversión aplicables para el trámite ante cualquier Banco de Proyectos y fuente de financiación; estos requisitos no sustituyen las normas a las cuales está sujeta la inversión pública, ni los requerimientos sectoriales vigentes. Así mismo no incluye el análisis y los conceptos que debe emitir cada instancia de control dentro del ciclo de viabilidad y aprobación del proyecto.
                </p><br/>
                <div className="tw-flex tw-justify-center">
                    <a  className=" tw-bg-blueColory tw-text-white
                                    tw-py-4 tw-px-6 tw-rounded tw-shadow"
                        href={`${URL_FILES}Files%2FLista-verificación-requisitos-de-proyectos-de-inversión-2021-TERRITORIAL.docx?alt=media`}
                        download={'Lista-verificación-requisitos-de-proyectos-de-inversión-2021-TERRITORIAL.docx'}>
                        <CloudDownload sx={{ color: '#FFFFFF' }}/>
                        Descargar el listado de verificación de requisitos
                    </a>
                </div><br/>
                <p>
                    A continuación podrá consultar modelos de certificados y cartas requeridos para el proceso de presentación de un proyecto de inversión según la naturaleza del mismo:
                </p><br/>
                <div className="tw-flex tw-justify-center">
                    <a  className=" tw-bg-blueColory tw-text-white
                                    tw-py-4 tw-px-6 tw-rounded tw-shadow"
                        href={`${URL_FILES}Files%2FModelo-de-Certificaciones-y-Cartas.docx?alt=media`}
                        download={'Modelo-de-Certificaciones-y-Cartas.docx'}>
                        <CloudDownload sx={{ color: '#FFFFFF' }}/>
                        Descargar los modelos de certificaciones y cartas
                    </a>
                </div><br/>
                <h1 className="tw-font-bold tw-text-xl">Lo invitamos a conocer la siguiente plataforma</h1>
                <p>
                    En donde encontrará información sobre proyectos de diversos sectores, en temas de formulación incluyendo el árbol de problemas y objetivos, el marco normativo, la alternativa de solución, el presupuesto y el cronograma.
                </p><br/>
                <a  href="https://proyectostipo.dnp.gov.co/"
                    target="_blank">
                    <img src={`${URL_FILES}Images%2Flogoproyectos.png?alt=media`}
                        width={300}
                        className="tw-m-auto tw-block tw-shadow-xl"/>
                </a>
                <br/>
            </div>
        </div>
    );
}
