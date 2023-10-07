import { useParams } from 'react-router-dom';
import { RegisterForm } from '../../components';

export const RegisterPage = () => {
    const { id } = useParams();
    const id_ = parseInt(id!);

    return (
        <RegisterForm id={id_}/>
    );
}