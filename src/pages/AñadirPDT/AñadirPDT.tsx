import { PDTForm } from "../../components"

export const AñadirPDT = () => {
    return (
        <div className="tw-container tw-mx-auto tw-border-t tw-border-x tw-my-4 tw-pb-10">
            <div className="tw-grid tw-grid-cols-12
                            tw-grid-row-6 tw-gap-6
                            tw-pb-4 tw-mx-5 tw-mb-5
                            tw-border-b-2 tw-border-slat-300">
                <div className="tw-col-start-4
                                tw-col-span-6
                                tw-bg-gray-400">
                    Alcalcia Municipal, Nombre Plan, PISAMI
                </div>
                <div className="tw-row-start-2 tw-row-end-5
                                tw-col-start-5 tw-col-span-4
                                tw-bg-gray-400
                                tw-rounded-b-3xl">
                    Cloud Control
                </div>
            </div>
            <div className="tw-flex tw-justify-center">
                <PDTForm/>
            </div>
        </div>
    )
}