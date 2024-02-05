import { SelectProps } from "@/interfaces";

export const Select = (props: SelectProps) => {
    return(
        <div className="tw-flex tw-justify-between">
            <label className="tw-mr-4 tw-self-center" htmlFor={props.id}>{props.label}</label>
            <select name={props.name}
                id={props.id}
                onChange={props.onChange}
                className=" tw-m-3 tw-p-2 
                            tw-w-1/2
                            tw-rounded 
                            tw-border-2 tw-border-gray-400"
                disabled={props.disabled}
                required={!!props.isRequired}>
                {props.optionLabelFn && props.options.map((e, i) => props.optionLabelFn && props.optionLabelFn(e, i))}
                {!props.optionLabelFn && props.options.map((e, i) => <option key={i} value={e}>{e}</option>)}
            </select>
        </div>

    );
}
