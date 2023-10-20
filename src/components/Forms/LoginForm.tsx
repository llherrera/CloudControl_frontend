import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doLogin } from '../../services/api'
import Cookies from 'js-cookie'

export const LoginForm = () => {
    const navigate = useNavigate()

    const [user, setuser] = useState({
        username: "",
        password: ""
    })
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setuser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            doLogin(user.username, user.password)
            .then((res) => {
                if (res.token === undefined) {
                    alert('Usuario o contraseña incorrectos')
                    return
                }
                Cookies.set('token', res.token, { expires: 1 })
                //sessionStorage.setItem('token', JSON.stringify(res.token))
                navigate('/lobby')
            })
        } catch (error) {
            console.log(error);
            
        }
        //navigate('/lobby')
    }

    const handleCancelar = () => {
        navigate('/')
    }
/**
 * <IconButton aria-label="delete"
                        size="small"
                        color="primary"
                        onClick={handleCancelar}
                        title="Regresar"
                        className=' tw-self-start'>
                <ArrowBackIosIcon/>
                <p className='tw-text-[#706E6B]'>Volver</p>
            </IconButton><br /><br />
 */
    return (
        <form className='   tw-rounded
                            tw-flex tw-flex-col
                            tw-px-10 tw-mx-6
                            tw-bg-[#FCFCFE]
                            tw-shadow-2xl'
                onSubmit={handleSubmit}>
            <label className='tw-font-montserrat'>Usuario</label>
            <input  type="text" 
                    name="username" 
                    onChange={handleChange}
                    className='tw-border tw-rounded'/><br/>
            <label className='tw-font-montserrat'>Clave</label>
            <input  type="password" 
                    name="password" 
                    onChange={handleChange}
                    className='tw-border tw-rounded'/><br/>
            <button className='tw-bg-[#008432] hover:tw-opacity-50
                                tw-rounded tw-py-2'>
                Iniciar sesión</button><br />
            <input  type="button" 
                    value={'¿Olvidaste tu contraseña?'}
                    className='tw-pb-10 hover:tw-bg-black-50' />
        </form>
    );
}