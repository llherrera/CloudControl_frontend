//import cclogo from '@/assets/images/ControlLand.png';
import cclogo from '@/assets/images/ControlLand2.png';
import { useAppSelector } from '@/store';
import { UnitFrameProps } from '@/interfaces';

export const UnitFrame = ({children}: UnitFrameProps) => {
    const {
        url_logo,
        url_logo_plan } = useAppSelector(store => store.content);

    return (
        <div className="tw-container tw-mx-auto tw-my-3
                        tw-bg-gray-200
                        tw-border-8 
                        tw-border-gray-400 tw-rounded-md ">
            <div className='tw-flex tw-justify-between
                            tw-mb-4
                            tw-shadow-2xl
                            tw-border-b-2 tw-border-gray-400
                            tw-z-40'>
                <img src={cclogo} alt="" width={100} height={100}/>
                <div className='tw-flex tw-gap-3'>
                    {url_logo && <img src={url_logo} alt="" title='Municipio' width={100} /> }
                    {url_logo_plan && <img src={url_logo_plan} alt="" title='Plan' width={100} /> }
                </div>
                <img src="/src/assets/images/Plan-indicativo.png" alt="" width={60} />
            </div>
            {children}
        </div>
    );
}