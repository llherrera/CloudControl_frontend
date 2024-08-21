import { InputProps, InputPropChild, SelectInputProps } from "@/interfaces";

const Component = ({children, classname, id, center, label}: InputPropChild) => {
    return (
        <div className={`tw-flex ${classname} tw-ml-3`}>
            <label  htmlFor={id}
                    className={`${center ? "tw-self-center" : ''}`}>{label}</label>
            {children}
        </div>
    );
}

export const Input = (props: InputProps) => {
    return(
        <Component
            classname={props.classname}
            id={props.id}
            center={props.center}
            label={props.label}>
            <input
                type={props.type}
                id={props.id}
                name={props.name}
                placeholder={props.placeholder ?? props.name}
                className={`tw-p-2 tw-rounded tw-border-2 tw-border-gray-400`}
                value={props.value}
                onChange={props.onChange}
                required/>
        </Component>
    );
}

export const SelectInput = (props: SelectInputProps) => {
    return(
        <Component
            classname={props.classname}
            id={props.id}
            center={props.center}
            label={props.label}>
            <select
                name={props.name}
                id={props.id}
                onChange={props.onChange}
                value={props.value}
                className=" tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400"
                disabled={props.disabled}
                required={!!props.isRequired}>
                    <option value=""></option>
                {props.options.map((e, i) =>
                    <option key={e} value={i}>{e}</option>
                )}
            </select>
        </Component>
    );
}
