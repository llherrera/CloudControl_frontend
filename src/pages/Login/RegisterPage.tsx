import { Frame, RegisterForm } from '@/components';

import { useAppSelector } from '@/store';

export const RegisterPage = () => {
    const { id_plan } = useAppSelector(state => state.content);

    return (
        <Frame data={
            <RegisterForm id={id_plan}/>
        }/>
    );
}