import { useLocation } from 'react-router-dom';
import { RegisterForm } from '../../components';
import { Frame } from '../../components';

export const RegisterPage = () => {
    const location = useLocation();
    const id = location.state?.id;
    const id_ = parseInt(id!);

    return (
        <Frame data={
            <RegisterForm id={id_}/>
        }/>
    );
}