import { useParams } from 'react-router-dom';
import { RegisterForm } from '../../components';
import { Frame } from '../../components';

export const RegisterPage = () => {
    const { id } = useParams();
    const id_ = parseInt(id!);

    return (
        <Frame data={
            <RegisterForm id={id_}/>
        }/>
    );
}