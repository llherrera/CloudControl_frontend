import { ModalOption } from './Modals';
import { BackBtn } from "../Buttons";
import { PropsCallback } from '@/interfaces';

export const Options = ({ callback }: PropsCallback) => {
    return (
        <div className='tw-mx-6 tw-my-3
                        tw-grid tw-grid-cols-2
                        tw-gap-3 tw-justify-items-stretch'>
            <h1 className=' tw-text-[#222222] tw-text-center
                            tw-font-bold tw-font-montserrat
                            tw-bg-white tw-rounded
                            tw-col-span-2'>
                <BackBtn handle={callback} id={18}/>
                PLANES DE ACCIÓN
            </h1>
            <ModalOption
                className='tw-bg-[#F1C19A] tw-rounded'
                i={0}/>
            <ModalOption
                className='tw-bg-[#F5CE76] tw-rounded'
                i={1}/>
            <ModalOption
                className='tw-bg-[#D3B3DD] tw-rounded'
                i={2}/>
            <ModalOption
                className='tw-bg-[#D5DFE2] tw-rounded'
                i={3}/>
            <ModalOption
                className='tw-bg-[#D159E1] tw-rounded'
                i={4}/>
            <button className=' tw-text-[#222222] tw-text-center
                                tw-font-bold tw-font-montserrat
                                tw-bg-white tw-rounded
                                tw-col-span-2'>
                Cerrar sesión
            </button>
        </div>
    );
}