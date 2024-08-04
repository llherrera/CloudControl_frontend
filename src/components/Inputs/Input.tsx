import { InputProps } from "@/interfaces";

export const Input = (props: InputProps) => {
    return(
        <div className={`tw-flex tw-justify-between ${props.classname}`}>
            <label  htmlFor={props.id}
                    className="tw-self-center">{props.label}</label>
            <input
                type={props.type}
                id={props.id}
                name={props.name}
                placeholder={props.placeholder ?? props.name}
                className={`tw-m-3 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400`}
                value={props.value}
                onChange={props.onChange}
                required/>
        </div>
    );
}
