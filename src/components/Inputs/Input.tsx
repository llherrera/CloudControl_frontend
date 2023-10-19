interface Props {
    type: string;
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, index:(number | void)) => void;
    isRequired?: boolean;
}

export const Input = (props: Props) => {
    return(
        <div className="tw-flex tw-justify-center">
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type={props.type}
                id={props.id}
                name={props.name}
                className="tw-border tw-rounded tw-ml-3"
                value={props.value}
                onChange={props.onChange}
                required/>
        </div>
    );
}