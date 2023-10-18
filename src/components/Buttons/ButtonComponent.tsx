import { useNavigate } from "react-router-dom";
import { ButtonProps } from "../../interfaces";
import Cookies from "js-cookie";

export const ButtonComponent = ( {lado, dir} : ButtonProps ) => {
    const navigate = useNavigate();

    const handleClick = () => {
        Cookies.remove('token');
        navigate( dir === 'izq' ? '/lobby' : '/login');
    }

    return (
        <button className={`${lado === 'izq' ? 'ml-3' : 'mr-3'}
                            ${lado === 'izq' ? 'col-start-1' : 'col-start-10'}
                            col-span-3
                            row-span-3
                            bg-cyan-500
                            shadow tw-hover:shadow-lg
                            ${lado === 'izq' ? 'rounded-r-full' : 'rounded-l-full'}`}
                onClick={ handleClick}
                title={`Entrar como ${lado === 'izq' ? 'ciudadano':'funcionario'}`}>
            {lado === 'izq' ? 'Ciudadanos' : 'Funcionarios'}
        </button>
    );
}