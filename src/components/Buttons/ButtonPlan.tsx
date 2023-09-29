export const ButtonPlan = (props: any) => {
    return (
        <button className=""
                onClick={props.handleButton}>
            <p  className=" bg-green-500
                            rounded-full
                            shadow
                            w-20 h-20">
                o
            </p>
            <p>
                {props.text}
            </p>
        </button>
    )
}