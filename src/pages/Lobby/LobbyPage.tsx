export const LobbyPage = () => {
    return (
        <div className="container mx-auto border my-4 pb-10">
            <div className="grid grid-cols-12 grid-row-6 gap-6">
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
                <button className=" row-start-3
                                    col-start-3
                                    bg-green-500
                                    rounded-full">
                    Plan indicativo
                </button>
                <button className=" row-start-5
                                    col-start-5
                                    bg-green-500
                                    rounded-full">
                    Banco de proyectos
                </button>
                <button className=" row-start-5
                                    col-start-8
                                    bg-green-500
                                    rounded-full">
                    POAI
                </button>
                <button className=" row-start-3
                                    col-start-10
                                    bg-green-500
                                    rounded-full">
                    Plan de accion
                </button>
            </div>
        </div>
    );
}