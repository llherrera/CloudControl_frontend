import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { addEvicenciaMeta, getNombreNivel, getNodoUnidadYAños } from "../../services/api"
import { AñoInterface, UnidadInterface, DetalleAño, EvidenciaInterface } from "../../interfaces"

export const AñadirEvidencia = () => {
    const navigate = useNavigate()
    const { idPDT, idNodo } = useParams();

    const [nombres, setNombres] = useState([[]]);
    const [unidForm, setUnidForm] = useState<UnidadInterface>({
        codigo: '',
        descripcion: '',
        indicador: '',
        base: 0,
        meta: 0,
    });
    const [añoForm, setañoForm] = useState<AñoInterface>({
        año: [],
        programacion: [],
        ejecFisica: [],
        ejecFinanciera: [],
    });

    let añosTemp = {
        año: [] as number[],
        programacion: [] as number[],
        ejecFisica: [] as number[],
        ejecFinanciera: [] as number[],
    };

    useEffect(() => {
        try {
            const ids = idNodo!.split('.');
            let ids2 = ids.reduce((acumulator:string[], currentValue) => {
                if (acumulator.length === 0) {
                    return [currentValue];
                } else {
                    const ultimoElemento = acumulator[acumulator.length - 1];
                    const concatenado = `${ultimoElemento}.${currentValue}`;
                    return [...acumulator, concatenado];
                }
            }, []);
            ids2 = ids2.slice(1);
            getNombreNivel(ids2).then((res) => {
                setNombres(res);
            });

            getNodoUnidadYAños(idPDT!, idNodo!).then((res) => {
                const { Nodo, Años } = res;
                if (Nodo === undefined) {
                    return;
                }
                setUnidForm({codigo: Nodo.Codigo,
                             descripcion: Nodo.Descripcion,
                             indicador: Nodo.Indicador,
                             base: Nodo.Linea_base,
                             meta: Nodo.Meta,
                });

                Años.forEach((dato:DetalleAño) => {
                    const año = new Date(dato.Año).getFullYear();
                    añosTemp.año.push(año);
                    añosTemp.programacion.push(dato.Programacion_fisica);
                    añosTemp.ejecFisica.push(dato.Ejecucion_Fisica);
                    añosTemp.ejecFinanciera.push(dato.Ejecucion_financiera);
                });
                setañoForm(añosTemp);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);
    
    const [cargar, setCargar] = useState(false)
    const [data, setData] = useState<EvidenciaInterface>({
        Fecha: "",
        DescripcionActividades: "",
        Unidad: "num",
        Cantidad: 0,
        Comuna: "Tubara",
        Barrio: "Soledad",
        Correguimiento: "Carrizal",
        Vereda: "Eden",
        PoblacionBeneficiada: "AdultoMayor",
        NumeroPoblacionBeneficiada: 0,
        RecursosEjecutados: 0,
        FuenteRecursos: "Privado",
        NombreDocumento: "",
        Lugar: "",
        Fecha2: ""
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    }

    const handleSubmitEvidencia = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        addEvicenciaMeta(unidForm.codigo, data)
        setCargar(!cargar)
    }

    const handleBack = () => {
        navigate(-1)
    }

    const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCargar(!cargar)
    }

    const memorias = () =>{
        return(
            <div className="tw-container tw-mx-auto tw-mt-2 tw-grid tw-grid-cols-12">
                <header className=" tw-col-start-2 tw-col-end-12
                                    tw-border-4 tw-border-double tw-border-gray-500">
                    <h1 className=" tw-text-3xl tw-font-bold tw-text-blue-700">Memoria de avance del Plan</h1>
                </header>
                <table className="  tw-col-start-3 tw-col-end-11 tw-mt-3 tw-table-fixed">
                    <thead>
                        <tr>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Dimension</label>
                            </th>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500 tw-px-12">
                                <label className="tw-font-bold">la dimension</label>
                            </th>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Codigo de la meta</label>
                            </th>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500 tw-px-12">
                                <label className="tw-font-bold">El codigo</label>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Sector</label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">El sector</label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Descripcion de meta</label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">una descripcion</label>
                            </td>
                        </tr>
                        <tr>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Programa</label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">El programa</label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">linea base</label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">0</label>
                            </td>
                        </tr>
                        <tr>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold"></label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold"></label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">meta</label>
                            </td>
                            <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">1</label>
                            </td>
                        </tr>    
                    </tbody>
                </table>
                <p className="  tw-col-start-3 tw-col-span-2 tw-mt-4
                                tw-justify-self-start">
                    Fecha: 01/02/1400
                </p>
                <p className="  tw-font-bold tw-col-start-5 tw-mt-4
                                tw-justify-self-start">
                    Lugar:
                </p>
                <input  className=" tw-ml-4 tw-py-4 tw-mt-4
                                    tw-grow tw-border
                                    tw-col-start-6 tw-col-end-11"
                        type="text" 
                        name="" 
                        id="" 
                />
                <p className="  tw-col-start-3 tw-col-span-2 tw-mt-4
                                tw-justify-self-start">
                    Hora: 23:59
                </p>
                <p className="  tw-font-bold tw-mt-4 tw-col-start-5 
                                tw-justify-self-start">
                    Responsable del cargo:
                </p>
                <input  className=" tw-ml-4 tw-py-4 tw-mt-4
                                    tw-grow tw-border
                                    tw-col-start-6 tw-col-end-11" 
                        type="text" 
                        name="" 
                        id="" 
                />
                <p className="  tw-font-bold tw-mt-4 tw-col-start-5 
                                tw-justify-self-start">
                    Descripción:
                </p>
                <input  className=" tw-ml-4 tw-py-4 tw-mt-4
                                    tw-grow tw-border
                                    tw-col-start-6 tw-col-end-11" 
                        type="text" 
                        name="" 
                        id="" 
                />
                <button className=" tw-col-span-full 
                                    tw-bg-blue-500
                                    tw-py-4 tw-mt-4
                                    tw-rounded
                                    tw-text-white tw-font-bold"
                        onClick={handleSubmitButton}>
                    cargar evidencias de esta meta
                </button>
            </div>
        )
    }

    const evidencias = () =>{
        return(
            <div className="tw-container tw-mx-auto tw-mt-2 tw-grid tw-grid-cols-12">
                <header className=" tw-col-span-full
                                    tw-border-4 tw-border-double tw-border-gray-500">
                    <h1 className=" tw-text-3xl tw-font-bold tw-text-blue-700">Evidencias de la meta</h1>
                    <button onClick={ (e) => handleSubmitButton(e)}>
                        return
                    </button>
                </header>
                <form action="" className="tw-col-span-full">
                    <label  htmlFor="">Fecha</label>
                    <input  type="date" 
                            name="Fecha"
                            id="Fecha" 
                            className="tw-border"
                            onChange={(e) => handleInputChange(e)}/><hr />

                    <label  htmlFor="">Codigo meta</label>
                    <label  htmlFor="">A.1.1.1.1</label><hr />

                    <label  htmlFor="">Descripcion Actividades</label>
                    <input  type="text" 
                            name="DescripcionActividades" 
                            id="DescripcionActividades" 
                            className="tw-border"
                            onChange={(e) => handleInputChange(e)}/><hr />

                    <label  htmlFor="">Numero de actividades</label><br />
                    <label  htmlFor="">Unidad</label>
                    <select name="Unidad"
                            id="Unidad"
                            className="tw-border"
                            onChange={(e) => handleInputChange(e)}
                            value={data.Unidad}>
                        <option value="num">Numeros</option>
                        <option value="char">Cadenas?</option>
                    </select><br />
                    <label  htmlFor="">Cantidad</label>
                    <input  type="number" 
                            name="Cantidad" 
                            id="Cantidad" 
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}/><hr />

                    <label  htmlFor="">Ubicacion</label><br />
                    <label  htmlFor="">Comuna</label>
                    <select name="Comuna"
                            id="Comuna"
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}
                            value={data.Comuna}>
                        <option value="Tubara">Tubara</option>
                        <option value="Baranoa">Baranoa</option>
                    </select><br />
                    <label  htmlFor="">Barrio</label>
                    <select name="Barrio"
                            id="Barrio"
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}
                            value={data.Barrio}>
                        <option value="Soledad">Soledad</option>
                        <option value="Galapa">Galapa</option>
                    </select><br />
                    <label  htmlFor="">Correguimiento</label>
                    <select name="Correguimiento" 
                            id="Correguimiento" 
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}
                            value={data.Correguimiento}>
                        <option value="Carrizal">Carrizal</option>
                        <option value="BrisasDelRio">Brisas del Rio</option>
                    </select><br />
                    <label  htmlFor="">Vereda</label>
                    <select name="Vereda" 
                            id="Vereda" 
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}
                            value={data.Vereda}>
                        <option value="Eden">El Eden</option>
                        <option value="Morrito">El Morrito</option>
                    </select><hr />

                    <label  htmlFor="">Poblacion beneficiada</label>
                    <select name="PoblacionBeneficiada" 
                            id="PoblacionBeneficiada" 
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}
                            value={data.PoblacionBeneficiada}>
                        <option value="AdultoMayor">Adulto Mayor</option>
                        <option value="Infantes">Infantes</option>
                    </select><br />

                    <label  htmlFor="">Numero de poblacion beneficiada</label>
                    <input  type="number" 
                            name="NumeroPoblacionBeneficiada" 
                            id="NumeroPoblacionBeneficiada" 
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}/><hr />

                    <label  htmlFor="">Recursos ejecutados</label>
                    <input  type="number" 
                            name="RecursosEjecutados" 
                            id="RecursosEjecutados" 
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}/><br />

                    <label  htmlFor="">Fuente de recursos</label>
                    <select name="FuenteRecursos" 
                            id="FuenteRecursos" 
                            className="tw-border"
                            onChange={(e)=> handleInputChange(e)}
                            value={data.FuenteRecursos}>
                        <option value="Privado">Sector privado</option>
                        <option value="Publico">Sector publico</option>
                    </select><hr />

                    <label  htmlFor="">Nombre y Archivo fotografico</label>
                    <input  type="file" 
                            name="FuenteRecursos" 
                            id="FuenteRecursos" 
                            onChange={(e) => handleInputChange(e)}/><br />
                    <label  htmlFor="">Nombre documento</label>
                    <input  type="text" 
                            name="NombreDocumento" 
                            id="NombreDocumento" 
                            className="tw-border"
                            onChange={(e) => handleInputChange(e)}/><br />
                    <label  htmlFor="">Lugar</label>
                    <input  type="text" 
                            name="Lugar" 
                            id="lugar" 
                            className="tw-border"
                            onChange={(e) => handleInputChange(e)}/><br />
                    <label  htmlFor="">Fecha</label>
                    <input  type="date" 
                            name="Fecha2" 
                            id="Fecha2" 
                            onChange={(e) => handleInputChange(e)}/><hr />

                    <div className="tw-flex tw-justify-center">
                        <button className=" tw-grow
                                            tw-bg-blue-500
                                            tw-py-4 tw-mt-4
                                            tw-rounded
                                            tw-text-white tw-font-bold"
                                onClick={handleSubmitEvidencia}>
                            Añadir evidencia
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return(
        cargar ? evidencias():memorias()
    )
}
