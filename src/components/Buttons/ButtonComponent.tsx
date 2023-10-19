import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Props {
    lado : String,
    dir : String
}

export const ButtonComponent = ( props : Props ) => {
    const navigate = useNavigate();

    const handleClick = () => {
        Cookies.remove('token');
        navigate( props.dir === 'izq' ? '/lobby' : '/login');
    }

    return (
        <button className={`${props.lado === 'izq' ? 'tw-ml-3' : 'tw-mr-3'}
                            ${props.lado === 'izq' ? 'tw-col-start-1' : 'tw-col-start-10'}
                            tw-col-span-3
                            tw-row-span-3
                            tw-bg-cyan-500
                            tw-shadow hover:tw-shadow-lg
                            ${props.lado === 'izq' ? 'tw-rounded-r-full' : 'tw-rounded-l-full'}`}
                onClick={ handleClick}
                title={`Entrar como ${props.lado === 'izq' ? 'ciudadano':'funcionario'}`}>
            {props.lado === 'izq' ? 'Ciudadanos' : 'Funcionarios'}
        </button>
    );
}