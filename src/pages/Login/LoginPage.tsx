import { LoginForm } from "@/components";
import { Header } from "@/components/Header";

export const LoginPage = () => {
    const componentes: JSX.Element[] = [
        <LoginForm key={0}/>
    ];

    return (
        <Header>
            {componentes}
        </Header>
    );
}