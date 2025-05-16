import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "@/store";

import { Input, BackBtn } from "@/components";
import { doRegister, doUpdateUser, doChangePassword, getUser,
    sendCodeToEmail, validateCode, sendChangePassword } from "@/services/api";
import { RegisterInterface, IdProps } from "@/interfaces";
import { validateEmail, notify, parseErrorAxios } from "@/utils";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/configs/firebaseConfig';
import { createUserWithEmailAndPassword, reauthenticateWithCredential, fetchSignInMethodsForEmail,
    updateEmail, updatePassword, EmailAuthProvider, getAuth, signOut } from "firebase/auth";

import { Box, CircularProgress } from '@mui/material';

import { UserManager } from '@/components/UserManager/UserManager';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export const RegisterForm = () => {
    return <UserManager />;
}

export const UpdateUserForm = () => {
    const navigate = useNavigate();

    const { logged, token_info } = useAppSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<RegisterInterface>({
        id_user: 0,
        username: '',
        lastname: '',
        email: '',
        password: '',
        confirm_password: '',
        rol: ''
    });
    const [oldUser, setOldser] = useState<RegisterInterface>({
        id_user: 0,
        username: '',
        lastname: '',
        email: '',
        password: '',
        confirm_password: '',
        rol: ''
    });

    useEffect(() => {
        const fetch = async () => {
            const res = await getUser();
            setOldser(res);
            setUser(res);
        }
        fetch()
    }, []);

    const handleInputChangeUser = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userFB = auth.currentUser;
        if (!userFB) {
            notify('No ha iniciado sesión para realizar esta acción', 'error');
            return navigate('/login', {replace: true});
        }
        if (user.username === oldUser.username &&
            user.lastname === oldUser.lastname &&
            user.email === oldUser.email
        ) return notify('No ha cambiado la información de su usuario', 'warning');
        if (user.username === '' || user.lastname === '' || user.email === '')
            return notify("Por favor llene todos los campos", 'warning');
        if (!validateEmail(user.email))
            return notify("El correo no es válido");
        try {
            setLoading(true);
            //user.email === oldUser.email ? null : await updateEmail(userFB, user.email);
            await doUpdateUser(user.id_user, user.email, user.username, user.lastname);
            notify('Se ha actualizado la información del usuario', 'success');
        } catch (err: any) {
            console.log(err);
            if (err.code === "auth/email-already-in-use") {
                try {
                    console.log('fui por aqui');
                    await doUpdateUser(user.id_user, user.email, user.username, user.lastname);
                    notify('Se ha actualizado la información del usuario', 'success');
                } catch (error) {
                    const error_ = parseErrorAxios(error);
                    if (error_.error_description === 'User already register') notify('Usuario ya registrado', 'error')
                    else notify('Ha ocurrido un error, vuelva a intentar mas tarde', 'error');
                }
            } else {
                console.log(err);
                notify(`Error al registrar usuario: ${err.msg}`, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tw-flex tw-justify-center tw-my-4">
            {!logged ?
            <div>
                Necesita iniciar sesión para realizar cambios en su usuario
            </div>
            : !token_info ? <div>
                No se ha proveido un token
            </div>
            : <form   onSubmit={submitForm}
                    className=" tw-px-10 tw-shadow-2xl
                                tw-rounded tw-bg-white">
                <h1 className=" tw-mb-4 tw-grow
                                tw-text-center tw-text-xl">
                    Actualizar usuario
                </h1>
                <div className="tw-flex tw-flex-col tw-gap-3">
                    <Input
                        value={user.username}
                        label={"Usuario"}
                        type={"text"}
                        id={"username"}
                        name={"username"}
                        onChange={ event => handleInputChangeUser(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                    <Input
                        value={user.lastname}
                        label={"Apellido"}
                        type={"text"}
                        id={"lastname"}
                        name={"lastname"}
                        onChange={ event => handleInputChangeUser(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                    <Input
                        value={user.email}
                        label={"Correo"}
                        type={"text"}
                        id={"email"}
                        name={"email"}
                        onChange={ event => handleInputChangeUser(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                    <button onClick={() => navigate('/contrasena')}>
                        Cambiar contraseña
                    </button>
                </div>
                <button type="submit"
                        className=' tw-bg-green-500 hover:tw-bg-green-300
                                    tw-py-2 tw-my-4
                                    tw-text-white tw-font-bold
                                    tw-rounded
                                    tw-w-full
                                    tw-grow'>
                    {loading ?
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    :   <p>Actualizar</p>
                    }
                </button>
            </form>
            }
        </div>
    );
}

export const ChangePassword = () => {
    const navigate = useNavigate();

    const min = 6, max = 16;
    const { logged } = useAppSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
    const [noHasSpace, setNoHasSpace] = useState(false);
    const [codeSend, setCodeSend] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [codename, setCodename] = useState('');
    const [user, setUser] = useState<RegisterInterface>({
        id_user: 0,
        username: '',
        lastname: '',
        email: '',
        password: '',
        confirm_password: '',
        rol: ''
    });

    useEffect(() => {
        const fetch = async () => {
            const res = await getUser();
            setUser(res);
        }
        logged ? fetch() : null;
    }, []);

    const handleOldPasswordChanhe = (event: React.ChangeEvent<HTMLInputElement>) => setOldPassword(event.target.value);
    const handleConPasswordChanhe = (event: React.ChangeEvent<HTMLInputElement>) => setConPassword(event.target.value);
    const handleNewPasswordChanhe = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const hasNumber = /[0-9]/.test(value);
        //const hasMayus  = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\-\\/]/.test(value);
        const noHasSpace = !/\s/.test(value);
        setHasNumber(hasNumber);
        //setHasMayus(hasMayus);
        setHasSpecialChar(hasSpecialChar);
        setNoHasSpace(noHasSpace);
        setNewPassword(value);
    };

    const validatePassword = (password: string) => {
        if (password.length >= min && password.length <= max) {
            //if (hasNumber && hasMayus && hasSpecialChar && noHasSpace) return true;
            if (hasNumber && hasSpecialChar && noHasSpace) return true;
            else return false;
        } else {
            return false;
        }
    };

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userFB = auth.currentUser;
        if (!userFB) {
            notify('No ha iniciado sesión para realizar esta acción', 'error');
            return navigate('/login', {replace: true});
        }
        if (oldPassword.trim() === '') return notify('No ha proporcionado una contraseña', 'warning');
        if (newPassword.trim() === '') return notify('No ha cambiado la información de su usuario', 'warning');
        if (conPassword.trim() === '') return notify('No ha cambiado la información de su usuario', 'warning');
        if (!validatePassword(newPassword)) return notify("La nueva contraseña no cumple con los requisitos", 'warning');
        if (newPassword !== conPassword) return notify('Por favor, verifique la contraseña', 'error');
        //if (!validateEmail(user.email))
        //    return notify("El correo no es válido");
        try {
            setLoading(true);
            //const credential = EmailAuthProvider.credential(userFB.email!, oldPassword);
            //await reauthenticateWithCredential(userFB, credential);
            //await updatePassword(userFB, newPassword);
            await doChangePassword(user.id_user, oldPassword, newPassword);
            //user.email === oldUser.email ? null : await updateEmail(userFB, user.email);
            notify('Se ha actualizado la contraseña', 'success');
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                try {
                    console.log('fui por aqui');
                    //await doUpdateUser(user.id_user, user.email, user.username, user.lastname);
                    notify('Se ha actualizado la información del usuario', 'success');
                } catch (error) {
                    const error_ = parseErrorAxios(error);
                    if (error_.error_description === 'User already register') notify('Usuario ya registrado', 'error')
                    else notify('Ha ocurrido un error, vuelva a intentar mas tarde', 'error');
                }
            } else {
                notify(`Error al registrar usuario: ${err.message}`, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="tw-flex tw-justify-center tw-my-4">
            {!logged ?
                !codeSend ?
                <NotSignIn callback={setCodeSend} callback2={setCodename} callbackMail={setEmail} callbackUser={setUsername} /> :
                isValid ?
                <ChangePasswordForm callback={setCodeSend} callback2={setIsValid} email={email} username={username}/> :
                <ValidateCode callback={setIsValid} codename={codename}/>
            : <form   onSubmit={submitForm}
                    className=" tw-px-10 tw-shadow-2xl
                                tw-rounded tw-bg-white">
                <h1 className=" tw-mb-4 tw-grow
                                tw-text-center tw-text-xl">
                    Cambiar contraseña
                </h1>
                <div className="tw-flex tw-flex-col tw-gap-3">
                    <Input
                        label={"Anterio contraseña"}
                        type={"password"}
                        id={"password"}
                        name={"password"}
                        onChange={e => handleOldPasswordChanhe(e)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                    <Input
                        label={"Nueva contraseña"}
                        type={"password"}
                        id={"new_password"}
                        name={"new_password"}
                        onChange={e => handleNewPasswordChanhe(e)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                    <Input
                        label={"Confirmar contraseña"}
                        type={"password"}
                        id={"confirm_password"}
                        name={"confirm_password"}
                        onChange={e => handleConPasswordChanhe(e)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                </div>
                <div className="tw-shadow tw-mb-3">
                    Requerimientos de la contraseña:
                    <p className={`${newPassword.length >= min && newPassword.length <= max ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {newPassword.length >= min && newPassword.length <= max ?
                        '✓' : 'X'} Entre 6 y 16 caracteres
                    </p>

                    <p className={`${hasNumber ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {hasNumber ? '✓' : 'X'} Al menos un número
                    </p>
                    <p className={`${hasSpecialChar ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {hasSpecialChar ? '✓' : 'X'} Al menos un caracter especia
                    </p>
                    <p className={`${noHasSpace ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {noHasSpace ? '✓' : 'X'} No espacios
                    </p>
                </div>
                <button type="submit"
                        className=' tw-bg-green-500 hover:tw-bg-green-300
                                    tw-py-2 tw-my-4
                                    tw-text-white tw-font-bold
                                    tw-rounded
                                    tw-w-full
                                    tw-grow'>
                    {loading ?
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    :   <p>Cambiar</p>
                    }
                </button>
            </form>
            }
        </div>
    );
}

interface NotSignInProps {
    callback: (value: boolean) => void;
    callback2: (value: string) => void;
    callbackMail: (value: string) => void;
    callbackUser: (value: string) => void;
    codename?: string;
}

interface ValidateProps {
    callback: (value: boolean) => void;
    codename: string;
}

interface ChangeProps {
    callback: (value: boolean) => void;
    callback2: (value: boolean) => void;
    email: string;
    username?: string;
}

const NotSignIn = ({ callback, callback2, callbackMail, callbackUser }: NotSignInProps) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChanhe = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
    const handleUsernameChanhe = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);

    const submitSendCodeToEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateEmail(email)) return notify("El correo no es válido");
        try {
            const data = await sendCodeToEmail(email);
            notify('Revise el correo ', 'success');
            callback(true);
            callback2(data.codename);
            callbackMail(data.email);
            callbackUser(data.username);
        } catch (error) {
            notify('Ocurrió un error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return(
        <form   onSubmit={submitSendCodeToEmail}
                className=" tw-px-10 tw-shadow-2xl
                            tw-rounded tw-bg-white">
            <h1 className=" tw-mb-4 tw-grow
                            tw-text-center tw-text-xl">
                Recuperar contraseña
            </h1>
            <div className="tw-flex tw-flex-col tw-gap-3">
                <Input
                    label={"Correo"}
                    type={"text"}
                    value={email}
                    id={"email"}
                    name={"email"}
                    onChange={e => handleEmailChanhe(e)}
                    center={true}
                    classname="tw-justify-between tw-gap-2"
                />
                <Input
                    label={"Usuario"}
                    type={"text"}
                    value={username}
                    id={"username"}
                    name={"username"}
                    onChange={e => handleUsernameChanhe(e)}
                    center={true}
                    isRequired={false}
                    classname="tw-justify-between tw-gap-2"
                />
            </div>
            <button type="submit"
                    className=' tw-bg-green-500 hover:tw-bg-green-300
                                tw-py-2 tw-my-4
                                tw-text-white tw-font-bold
                                tw-rounded
                                tw-w-full
                                tw-grow'>
                {loading ?
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                :   <p>Enviar código</p>
                }
            </button>
        </form>
    );
}

const ValidateCode = ({ callback, codename }: ValidateProps) => {

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCodeChanhe = (event: React.ChangeEvent<HTMLInputElement>) => setCode(event.target.value);

    const submitCodeToValidated = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            await validateCode(code, codename);
            notify('Código validado correctamente', 'success');
            callback(true);
        } catch (error) {
            notify('Ocurrió un error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form   onSubmit={submitCodeToValidated}
                className=" tw-px-10 tw-shadow-2xl
                            tw-rounded tw-bg-white">
            <h1 className=" tw-mb-4 tw-grow
                            tw-text-center tw-text-xl">
                Digite el código
            </h1>
            <div className="tw-flex tw-flex-col tw-gap-3">
                <Input
                    label={"Código"}
                    value={code}
                    type={"text"}
                    id={"code"}
                    name={"code"}
                    onChange={e => handleCodeChanhe(e)}
                    center={true}
                    classname="tw-justify-between tw-gap-2"
                />
            </div>
            <button type="submit"
                    className=' tw-bg-green-500 hover:tw-bg-green-300
                                tw-py-2 tw-my-4
                                tw-text-white tw-font-bold
                                tw-rounded
                                tw-w-full
                                tw-grow'>
                {loading ?
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                :   <p>Validar código</p>
                }
            </button>
        </form>
    );
}

const ChangePasswordForm = ({ callback, callback2, email, username }: ChangeProps) => {
    const navigate = useNavigate();

    const min = 6, max = 16;
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
    const [noHasSpace, setNoHasSpace] = useState(false);

    const handleConPasswordChanhe = (event: React.ChangeEvent<HTMLInputElement>) => setConPassword(event.target.value);
    const handleNewPasswordChanhe = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const hasNumber = /[0-9]/.test(value);
        //const hasMayus  = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\-\\/]/.test(value);
        const noHasSpace = !/\s/.test(value);
        setHasNumber(hasNumber);
        //setHasMayus(hasMayus);
        setHasSpecialChar(hasSpecialChar);
        setNoHasSpace(noHasSpace);
        setNewPassword(value);
    };

    const submitRecoverPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            await sendChangePassword(email, newPassword, username);
            callback(false);
            callback2(false);
            notify('Contraseña actualizada', 'success');
            navigate('/login', { replace: true });
        } catch (error) {
            notify('Ocurrió un error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return(
        <form   onSubmit={submitRecoverPassword}
                className=" tw-px-10 tw-shadow-2xl
                            tw-rounded tw-bg-white"
                >
            <h1 className=" tw-mb-4 tw-grow
                            tw-text-center tw-text-xl">
                Cambiar contraseña
            </h1>
            <div className="tw-flex tw-flex-col tw-gap-3">
                <Input
                    label={"Nueva contraseña"}
                    type={"password"}
                    value={newPassword}
                    id={"new_password"}
                    name={"new_password"}
                    onChange={e => handleNewPasswordChanhe(e)}
                    center={true}
                    classname="tw-justify-between tw-gap-2"/>
                <Input
                    label={"Confirmar contraseña"}
                    type={"password"}
                    value={conPassword}
                    id={"confirm_password"}
                    name={"confirm_password"}
                    onChange={e => handleConPasswordChanhe(e)}
                    center={true}
                    classname="tw-justify-between tw-gap-2"/>
            </div>
            <div className="tw-shadow tw-mb-3">
                Requerimientos de la contraseña:
                <p className={`${newPassword.length >= min && newPassword.length <= max ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                    {newPassword.length >= min && newPassword.length <= max ?
                    '✓' : 'X'} Entre 6 y 16 caracteres
                </p>
                <p className={`${hasNumber ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                    {hasNumber ? '✓' : 'X'} Al menos un número
                </p>
                <p className={`${hasSpecialChar ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                    {hasSpecialChar ? '✓' : 'X'} Al menos un caracter especia
                </p>
                <p className={`${noHasSpace ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                    {noHasSpace ? '✓' : 'X'} No espacios
                </p>
            </div>
            <button type="submit"
                    className=' tw-bg-green-500 hover:tw-bg-green-300
                                tw-py-2 tw-my-4
                                tw-text-white tw-font-bold
                                tw-rounded
                                tw-w-full
                                tw-grow'>
                {loading ?
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                :   <p>Enviar</p>
                }
            </button>
        </form>
    );
}
