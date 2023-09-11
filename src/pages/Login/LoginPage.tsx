import { LoginForm } from "../../components"

export const LoginPage = () => {
    return (
        <div className="container mx-auto border my-4 pb-10">
            <div className="grid grid-cols-12 grid-row-6 gap-6">
                <LoginForm/>
                <div className="col-start-4
                                col-span-6
                                bg-gray-400">
                    Alcalcia Municipal, Nombre Plan, PISAMI
                </div>
                <div className="row-start-2
                                col-start-5
                                col-span-4
                                row-end-5
                                bg-gray-400
                                rounded-b-3xl">
                    Cloud Control
                </div>
            </div>
        </div>
    )
}