import { SelectProps } from "@/interfaces";

export const Select = (props: SelectProps) => {
    return(
        <div className="">
            <label className="tw-mr-4" htmlFor={props.id}>{props.label}</label>
            <select name={props.name}
                id={props.id}
                onChange={props.onChange}
                className="tw-mb-3 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                disabled={props.disabled}
                required={!!props.isRequired}>
                {props.optionLabelFn && props.options.map((e, i) => props.optionLabelFn && props.optionLabelFn(e, i))}
                {!props.optionLabelFn && props.options.map((e, i) => {
                  return <option key={i} value={e}>{e}</option>
                })}
            </select>
        </div>

    );
}
