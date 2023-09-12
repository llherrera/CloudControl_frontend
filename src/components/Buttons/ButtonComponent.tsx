import { useNavigate } from "react-router-dom";
import { ButtonProps } from "../../interfaces";

export const ButtonComponent = ( {lado, dir} : ButtonProps ) => {
    const navigate = useNavigate();

    return (
        <button className={`${lado === 'izq' ? 'ml-3' : 'mr-3'}
                            ${lado === 'izq' ? 'col-start-1' : 'col-start-10'}
                            col-span-3
                            row-span-3
                            bg-cyan-500
                            shadow hover:shadow-lg
                            ${lado === 'izq' ? 'rounded-r-full' : 'rounded-l-full'}`}
                onClick={ () => navigate( dir === 'izq' ? '/lobby' : '/login')}>
            {lado === 'izq' ? 'Ciudadanos' : 'Funcionarios'}
        </button>
    );
}