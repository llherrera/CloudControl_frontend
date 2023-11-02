type Props = {
    componentes: React.ReactNode[]
}

export const Header = ( {componentes}: Props) => {
    return (
        <main className="   tw-mx-auto tw-my-4
                            tw-grid tw-grid-cols-2
                            tw-items-center
                            tw-h-screen">
            <div className="tw-border-r tw-border-black
                            tw-pr-4
                            tw-justify-self-end">
                <img src="\src\assets\images\Logo.png" alt="" />
                <img src="\src\assets\images\Logo-Municipio.png" alt="" /><br />
                <p className="tw-font-montserrat tw-font-bold">
                    Selecciona un usuario en la derecha para comenzar</p>
            </div>
            <ul className="tw-pl-3">
                {componentes.map((componente, index) => (
                    <li key={index} className="tw-m-3">
                        {componente}
                    </li>
                ))
                }
            </ul>
        </main>
    )
}