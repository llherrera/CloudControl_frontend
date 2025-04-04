import Modal from 'react-modal';
import { Spinner } from "@/assets/icons";

export const ModalSpinner = ({isOpen}:{isOpen: boolean}) => {
    return (
        <Modal  isOpen={isOpen}
                className='tw-flex tw-flex-col tw-items-center tw-justify-center'
                overlayClassName='tw-fixed tw-inset-0 tw-bg-black tw-opacity-50'>
            <Spinner/>
            <p className='tw-text-[#222222] 
                            tw-font-bold tw-text-lg 
                            tw-font-montserrat'>
                Cargando...
            </p>
        </Modal>
    );
};