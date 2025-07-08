import React from "react";
import { LoginForm } from "@/components";
import { Header } from "@/components/Header";

export const LoginPage = () => {
    return (
        <div className="tw-min-h-screen tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-green-100 tw-to-green-300">
            <div className="tw-w-[90%] tw-h-auto tw-mx-2 tw-my-4 tw-p-4 tw-bg-white tw-rounded-2xl tw-shadow-lg tw-flex tw-flex-col tw-items-center
                md:tw-flex-row md:tw-items-center md:tw-justify-center md:tw-w-[70%] md:tw-h-[80%] md:tw-mx-12 md:tw-my-12 md:tw-p-8 md:tw-max-w-4xl">
                <div className="tw-w-full md:tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center">
                    <Header><React.Fragment />
                        <div className="tw-w-full md:tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-mb-4 tw-mt-4 md:tw-mt-0 md:tw-mb-0">
                            <p className="tw-mb-4 tw-text-gray-700 tw-text-center tw-text-base md:tw-text-lg tw-mb-4">Por favor, ingresa tus datos para acceder a la plataforma:</p>
                            <LoginForm key={0} />
                        </div>
                    </Header>
                </div>

            </div>
        </div>
    );
}