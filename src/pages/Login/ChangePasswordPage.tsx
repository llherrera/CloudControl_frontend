import { Frame, Header, ChangePassword } from '@/components';
import { useAppSelector } from "@/store";

export const ChangePasswordPage = () => {
    const { logged } = useAppSelector(store => store.auth);
    return(
        logged ? 
        <Frame>
            <ChangePassword/>
        </Frame> : <Header>
            <ChangePassword/>
        </Header>
    );
}