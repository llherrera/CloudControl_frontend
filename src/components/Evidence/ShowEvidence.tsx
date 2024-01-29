import { EvidenceDetailProps } from '@/interfaces';

export const ShowEvidence = ( {evi}: EvidenceDetailProps ) => {
    return (
        <tr>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black`}>
                {new Date(evi.date).getDate()}/{new Date(evi.date).getMonth()+1}/{new Date(evi.date).getFullYear()}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden lg:tw-table-cell`}>
                {evi.activitiesDesc}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden lg:tw-table-cell`}>
                {evi.commune}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden md:tw-table-cell`}>
                {evi.neighborhood}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden md:tw-table-cell`}>
                {evi.unit}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden md:tw-table-cell`}>
                {evi.amount}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black`}>
                {evi.benefited_population}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black`}>
                {evi.benefited_population_number}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden md:tw-table-cell`}>
                {new Date(evi.date_file).getDate()}/{new Date(evi.date_file).getMonth()+1}/{new Date(evi.date_file).getFullYear()}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black`}>
                <a href={evi.file_link} target="_blank">Visitar</a>
            </th>
        </tr>
    );
}