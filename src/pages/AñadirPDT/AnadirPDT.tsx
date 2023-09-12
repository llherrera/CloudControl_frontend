import { PDTForm } from "../../components/Forms"

export const AnadirPDT = () => {
    return (
        <div className="container mx-auto border-t border-x my-4 pb-10">
            <div className="grid
                            grid-cols-12
                            grid-row-6
                            gap-6
                            pb-4
                            border-b-2
                            border-slat-300
                            mx-5
                            mb-5">
                <div className="col-start-4
                                col-span-6
                                bg-gray-400">
                    Alcalcia Municipal, Nombre Plan, PISAMI
                </div>
                <div className="row-start-2
                                row-end-5
                                col-start-5
                                col-span-4
                                bg-gray-400
                                rounded-b-3xl">
                    Cloud Control
                </div>
            </div>
            <div className="flex justify-center">
                <PDTForm/>
            </div>
        </div>
    )
}