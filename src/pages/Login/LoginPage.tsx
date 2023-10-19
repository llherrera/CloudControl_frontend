import { LoginForm } from "../../components"

export const LoginPage = () => {
    return (
        <div className="tw-container tw-mx-auto tw-border tw-my-4 tw-pb-10">
            <div className="tw-grid tw-grid-cols-12 tw-grid-row-6 tw-gap-6">
                <LoginForm/>
                <div className="tw-col-start-4
                                tw-col-span-6
                                tw-bg-gray-400">
                    Alcalcia Municipal, Nombre Plan, PISAMI
                </div>
                <div className="tw-row-start-2
                                tw-col-start-5
                                tw-col-span-4
                                tw-row-end-5
                                tw-bg-gray-400
                                tw-rounded-b-3xl">
                    Cloud Control
                </div>
            </div>
        </div>
    )
}