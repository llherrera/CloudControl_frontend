import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { BackBtnProps } from "@/interfaces";

export const BackBtn = ({handleBack, id}: BackBtnProps) => {
    return (
        <IconButton aria-label="delete"
                    size="small"
                    color="secondary"
                    onClick={handleBack}
                    title="Regresar"
                    key={id}>
            <ArrowBackIosIcon/>
        </IconButton>
    )
}