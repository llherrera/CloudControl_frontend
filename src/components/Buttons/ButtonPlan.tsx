import { BtnPlanProps } from '@/interfaces';

export const ButtonPlan = (props: BtnPlanProps) => {
    return (
        <button className=""
                onClick={props.handleButton}>
            <p  className={`tw-bg-green-500
                            tw-rounded-full
                            tw-shadow
                            tw-w-20 tw-h-20
                            hover:tw-bg-green-600`}
                style={{ left: props.x, top: props.y }}>
                o
            </p>
            <p className="tw-w-20 tw-break-words">
                {props.text}
            </p>
        </button>
    );
}