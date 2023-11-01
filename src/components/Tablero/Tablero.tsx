import { useState, useEffect } from 'react'
import { Content } from './Content';
import { PesosNodos, Porcentaje, DetalleAño, NivelInterface } from '../../interfaces';
import { useParams } from 'react-router-dom';
import { getProgresoTotal } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import * as svg from '../../assets/icons';

interface Props {
    data: NivelInterface[];
}

export const Tablero = ( props : Props ) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [index, setIndex] = useState(0);
    const [Padre, setPadre] = useState<string | null>(null);

    const [getProgress, setGetProgress] = useState(false);

    const setData = (index: number, padre: (string | null)) => {
        if (index < props.data.length && index >= 0) {
            setIndex(index)
            setPadre(padre)
        }
    }

    useEffect(() => {
        const id_ = parseInt(id as string)

        getProgresoTotal(id_)
            .then((res) => {
                if (!res) return
                localStorage.setItem('pesosNodo', JSON.stringify(res[0]))
                localStorage.setItem('detalleAño', JSON.stringify(res[1]))
                calcProgress()
                setGetProgress(true)
            })
            .catch((err) => {
                console.log(err);
            })

    }, [])

    const calcProgress = () => {
        const pesosStr = localStorage.getItem('pesosNodo')
        const detalleStr = localStorage.getItem('detalleAño')
        if (pesosStr === null || pesosStr === undefined || detalleStr === null || detalleStr === undefined) 
            return console.log('No hay datos')
        let pesosNodo = JSON.parse(pesosStr ?? '[]')
        let detalleAño = JSON.parse(detalleStr ?? '[]')
        
        detalleAño.forEach((item: DetalleAño) => {
            let progreso = 0
            if (item.Programacion_fisica !== 0)
                progreso = item.Ejecucion_Fisica / item.Programacion_fisica
                progreso = parseFloat(progreso.toFixed(2))
            let peso = pesosNodo.find((peso: PesosNodos) => peso.id_nodo === item.id_nodo)
            if (peso) {
                peso.porcentajes = peso.porcentajes ? peso.porcentajes : []
                peso.porcentajes.push({ progreso : progreso, año: item.Año, programacion: item.Programacion_fisica })
            }
        })

        pesosNodo.forEach((item: PesosNodos) => {
            const { porcentajes, Padre } = item
            if (porcentajes) {
                if (Padre){
                    porcentajes.forEach((porcentaje: Porcentaje) => {
                        let padre = pesosNodo.find((e: PesosNodos) => e.id_nodo === Padre)
                        if (padre) {
                            let progresoPeso = porcentaje.progreso * (item.Peso / 100)
                            progresoPeso = parseFloat(progresoPeso.toFixed(2))
                            padre.porcentajes = padre.porcentajes ? padre.porcentajes : []
                            const temp = padre.porcentajes.find((e: Porcentaje) => e.año === porcentaje.año)
                            if (temp) {
                                temp.progreso += progresoPeso
                            } else {
                                padre.porcentajes.push({ progreso : progresoPeso, año: porcentaje.año })
                            }
                        }
                    })
                }
            } else {

            }
        })
        localStorage.setItem('pesosNodo', JSON.stringify(pesosNodo))
    }

    const bgcolor='greenBtn'
    const logocolor='#FFFFFF'
    const textcolor='white'

    const buttons = [
        {
            inside: true,
            onClick: () => navigate('/'), 
            text: 'Plan indicativo', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: ()=>svg.PlanIndicativoIcon('#008432')
        },
        {
            inside: true, 
            onClick: () => navigate('/'), 
            text: 'Banco de proyectos', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: ()=>svg.BancoProyectoIcon(logocolor)
        },
        {
            inside: true, 
            onClick: () => navigate('/'), 
            text: 'POAI', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: ()=>svg.POAIIcon(logocolor)
        },
        {
            inside: true, 
            onClick: () => navigate('/'), 
            text: 'Plan de accion', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: ()=>svg.PlanAccionIcon(logocolor)
        }
    ]

    return (
        <Content    
            index={index+1} 
            len={props.data.length}
            data={props.data[index]} 
            callback={setData} 
            Padre={Padre} 
            id={ parseInt(id as string) }
            progress={getProgress}
        />
    )
}
 