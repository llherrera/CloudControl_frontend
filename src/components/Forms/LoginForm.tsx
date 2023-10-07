import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doLogin } from '../../services/api'

export const LoginForm = () => {
    const navigate = useNavigate()

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setusername(e.target.value)
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setpassword(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            doLogin(username, password)
            .then((res) => {
                if (res.token === undefined) {
                    alert('Usuario o contraseña incorrectos')
                    return
                }
                sessionStorage.setItem('token', JSON.stringify(res.token))
                navigate('/lobby')
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    const handleCancelar = () => {
        setusername("")
        setpassword("")
    }

    return (
        <form   onSubmit={handleSubmit}
                className=' col-start-2
                            row-start-1 row-span-3'>
            <div>
                <label htmlFor="user">Usuario</label>
                <input
                    type="text"
                    name="user"
                    id="user"
                    className='border rounded'
                    value={username}
                    onChange={handleUsername}
                />
            </div>
            <div>
                <label htmlFor="password">Contraseña</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className='border rounded'
                    value={password}
                    onChange={handlePassword}
                />
            </div>
            <div className='flex '>
                <button type="submit" className='bg-green-500 py-1 px-3 rounded'>Entrar</button>
                <button type="button" className='bg-red-500 py-1 px-3 rounded' onClick={handleCancelar}>Cancelar</button>
            </div>
        </form>
    )
}