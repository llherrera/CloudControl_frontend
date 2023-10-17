import { ButtonPlanProps } from "../../interfaces"

export const ButtonPlan = (props: ButtonPlanProps) => {
    return (
        <button className=""
                onClick={props.handleButton}>
            <p  className={`bg-green-500
                            rounded-full
                            shadow
                            w-20 h-20`}
                style={{ left: props.x, top: props.y }}>
                o
            </p>
            <p className="w-20 break-words">
                {props.text}
            </p>
        </button>
    )
}