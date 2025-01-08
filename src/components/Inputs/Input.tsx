import { InputProps, InputPropChild, SelectInputProps,
    PropsInputLabel, PropsInputTable } from "@/interfaces";

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

export const InputLabel = ({name, label, id, onChange, errors, className, value}: PropsInputLabel) => {
    return (
        <div className={`tw-my-2 ${className}`}>
            <label
                className="tw-col-start-1 tw-justify-self-end tw-self-center"
                htmlFor={id}>
                {label}:
            </label>
            <input
                value={value}
                onChange={onChange}
                type="text"
                name={name}
                id={id}
                className={`tw-col-start-2
                            tw-w-48 tw-p-2 tw-rounded
                            tw-border-2
                            ${errors[name] ? 'tw-border-red-400' : 'tw-border-gray-400' }
                            tw-bg-white`}
            />
        </div>
    );
}

export const InputTable = ({name, type, value, onChange, errors, className}: PropsInputTable) => {
    return (
        <input
            onChange={e => onChange(e)}
            type={type}
            value={value}
            name={name}
            id={name}
            className={`${className}
                        tw-w-full tw-rounded
                        tw-border-2 tw-my-2
                        ${errors[name] ? 'tw-border-red-400' : 'tw-border-gray-400' }
                        `}
        />
    );
}
