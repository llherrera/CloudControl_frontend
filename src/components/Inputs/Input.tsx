import { InputProps } from "../../interfaces";

export const Input = (props: InputProps) => {
    return(
        <div className="flex justify-center">
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type={props.type}
                id={props.id}
                name={props.name}
                className="border rounded ml-3"
                value={props.value}
                onChange={props.onChange}
                required/>
        </div>
    );
}