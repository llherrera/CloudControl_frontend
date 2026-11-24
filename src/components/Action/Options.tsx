import { ModalOption } from './Modals';
import { BackBtn } from "../Buttons";
import { PropsCallback } from '@/interfaces';
import { useAppSelector } from '@/store';

export const Options = ({ callback }: PropsCallback) => {
    const { logged } = useAppSelector(store => store.auth);

    return (
        <div className='tw-mx-6 tw-my-3
                        tw-grid tw-grid-cols-2
                        tw-gap-3 tw-justify-items-stretch'>
            <h1 className=' tw-text-[#222222] tw-text-center
                            tw-font-bold tw-font-montserrat tw-text-2xl
                            tw-bg-white tw-rounded
                            tw-col-span-2'>
                <BackBtn handle={callback} id={18}/>
                PLANES DE ACCIÓN {!logged ? '(SOLO LECTURA)' : ''}
            </h1>
            {logged && (
                <>
                    <ModalOption
                        className='tw-bg-[#F5CE76] tw-rounded tw-font-bold tw-text-2xl'
                        i={1}/>
                    <ModalOption
                        className='tw-bg-[#D3B3DD] tw-rounded tw-font-bold tw-text-2xl'
                        i={2}/>
                </>
            )}
            <ModalOption
                className={`tw-bg-[#F1C19A] ${!logged ? 'tw-col-span-2' : ''}`}
                i={0}/>
            {logged && (
                <>
                    <ModalOption
                        className='tw-bg-[#D5DFE2] tw-rounded tw-font-bold tw-text-2xl'
                        i={3}/>
                    <ModalOption
                        className='tw-bg-[#D159E1] tw-rounded tw-font-bold tw-text-2xl'
                        i={4}/>
                </>
            )}
        </div>
    );
};
