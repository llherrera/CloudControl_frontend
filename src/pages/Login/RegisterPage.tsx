import { Frame, RegisterForm } from '@/components/Citizen';

import { useAppSelector } from '@/store';

export const RegisterPage = () => {

    return (
        <Frame>
            <RegisterForm/>
        </Frame>
    );
}