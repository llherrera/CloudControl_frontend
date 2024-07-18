import { Frame, RegisterForm } from '@/components';

import { useAppSelector } from '@/store';

export const RegisterPage = () => {
    const { id_plan } = useAppSelector(store => store.content);

    return (
        <Frame>
            <RegisterForm id={id_plan}/>
        </Frame>
    );
}