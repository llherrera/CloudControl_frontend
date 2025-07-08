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
import { User2 } from "lucide-react";

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
        <div className="tw-flex tw-justify-center tw-items-center tw-min-h-[70vh]">
            <div className="tw-bg-white tw-shadow-2xl tw-rounded-2xl tw-p-8 tw-w-full tw-max-w-md">
                <div className="tw-flex tw-flex-col tw-items-center tw-mb-6">
                    <User2 size={48} className="tw-text-green-500 tw-mb-2" />
                    <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">Actualizar usuario</h1>
                    <p className="tw-text-gray-500 tw-text-sm tw-mt-1">Modifica tu información personal</p>
                </div>
                {!logged ? (
                    <div className="tw-text-center tw-text-red-500 tw-font-semibold">
                        Necesita iniciar sesión para realizar cambios en su usuario
                    </div>
                ) : !token_info ? (
                    <div className="tw-text-center tw-text-red-500 tw-font-semibold">
                        No se ha proveido un token
                    </div>
                ) : (
                    <form onSubmit={submitForm} className="tw-space-y-5">
                        <div>
                            <Input
                                value={user.username}
                                label="Usuario"
                                type="text"
                                id="username"
                                name="username"
                                onChange={handleInputChangeUser}
                                center={false}
                                classname="tw-flex-col"
                            />
                        </div>
                        <div>
                            <Input
                                value={user.lastname}
                                label="Apellido"
                                type="text"
                                id="lastname"
                                name="lastname"
                                onChange={handleInputChangeUser}
                                center={false}
                                classname="tw-flex-col"
                            />
                        </div>
                        <div>
                            <Input
                                value={user.email}
                                label="Correo"
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChangeUser}
                                center={false}
                                classname="tw-flex-col"
                            />
                        </div>
                        <div className="tw-flex tw-justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/contrasena')}
                                className="tw-text-green-600 hover:tw-underline tw-text-sm"
                            >
                                Cambiar contraseña
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-bold tw-py-3 tw-rounded-xl tw-w-full tw-mt-2 tw-transition"
                            disabled={loading}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress size={24} color="inherit" />
                                </Box>
                            ) : (
                                "Actualizar"
                            )}
                        </button>
                    </form>
                )}
            </div>
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
        <div className="tw-min-h-screen tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-green-100 tw-to-green-300 tw-p-4">
            <div className="tw-w-full tw-max-w-2xl tw-bg-white tw-rounded-2xl tw-shadow-lg tw-flex tw-flex-col tw-items-center tw-p-6 md:tw-p-8">
                {!logged ?
                    !codeSend ?
                    <NotSignIn callback={setCodeSend} callback2={setCodename} callbackMail={setEmail} callbackUser={setUsername} /> :
                    isValid ?
                    <ChangePasswordForm callback={setCodeSend} callback2={setIsValid} email={email} username={username}/> :
                    <ValidateCode callback={setIsValid} codename={codename}/>
                : (
                    <>
                        <h1 className="tw-text-3xl tw-font-bold tw-mb-2 tw-text-green-700">Cambiar contraseña</h1>
                        <p className="tw-mb-8 tw-text-gray-600 tw-text-center">Ingresa tu contraseña actual y la nueva contraseña</p>
                        <form onSubmit={submitForm} className="tw-w-full tw-max-w-md tw-space-y-5">
                            <div>
                                <Input
                                    label={"Contraseña anterior"}
                                    type={"password"}
                                    id={"password"}
                                    name={"password"}
                                    onChange={e => handleOldPasswordChanhe(e)}
                                    center={true}
                                    classname="tw-justify-between tw-gap-2"/>
                            </div>
                            <div>
                                <Input
                                    label={"Nueva contraseña"}
                                    type={"password"}
                                    id={"new_password"}
                                    name={"new_password"}
                                    onChange={e => handleNewPasswordChanhe(e)}
                                    center={true}
                                    classname="tw-justify-between tw-gap-2"/>
                            </div>
                            <div>
                                <Input
                                    label={"Confirmar contraseña"}
                                    type={"password"}
                                    id={"confirm_password"}
                                    name={"confirm_password"}
                                    onChange={e => handleConPasswordChanhe(e)}
                                    center={true}
                                    classname="tw-justify-between tw-gap-2"/>
                            </div>
                            <div className="tw-bg-gray-50 tw-p-4 tw-rounded-xl tw-mb-4">
                                <h3 className="tw-font-semibold tw-text-gray-700 tw-mb-3">Requerimientos de la contraseña:</h3>
                                <div className="tw-space-y-2">
                                    <p className={`tw-flex tw-items-center tw-gap-2 ${newPassword.length >= min && newPassword.length <= max ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                                        <span>{newPassword.length >= min && newPassword.length <= max ? '✓' : '✗'}</span>
                                        Entre 6 y 16 caracteres
                                    </p>
                                    <p className={`tw-flex tw-items-center tw-gap-2 ${hasNumber ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                                        <span>{hasNumber ? '✓' : '✗'}</span>
                                        Al menos un número
                                    </p>
                                    <p className={`tw-flex tw-items-center tw-gap-2 ${hasSpecialChar ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                                        <span>{hasSpecialChar ? '✓' : '✗'}</span>
                                        Al menos un caracter especial
                                    </p>
                                    <p className={`tw-flex tw-items-center tw-gap-2 ${noHasSpace ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                                        <span>{noHasSpace ? '✓' : '✗'}</span>
                                        Sin espacios
                                    </p>
                                </div>
                            </div>
                            <button type="submit"
                                    className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-bold tw-py-3 tw-rounded-xl tw-w-full tw-transition tw-duration-200 tw-disabled:tw-opacity-50 tw-disabled:tw-cursor-not-allowed"
                                    disabled={loading}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CircularProgress size={24} color="inherit" />
                                    </Box>
                                ) : (
                                    "Cambiar contraseña"
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
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
        <>
            <h1 className="tw-text-3xl tw-font-bold tw-mb-2 tw-text-green-700">Recuperar contraseña</h1>
            <p className="tw-mb-8 tw-text-gray-600 tw-text-center">Ingresa tu correo electrónico para recibir un código de verificación</p>
            <form onSubmit={submitSendCodeToEmail} className="tw-w-full tw-max-w-md tw-space-y-5">
                <div>
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
                </div>
                <div>
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
                        className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-bold tw-py-3 tw-rounded-xl tw-w-full tw-transition tw-duration-200 tw-disabled:tw-opacity-50 tw-disabled:tw-cursor-not-allowed"
                        disabled={loading}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress size={24} color="inherit" />
                        </Box>
                    ) : (
                        "Enviar código"
                    )}
                </button>
            </form>
        </>
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
        <>
            <h1 className="tw-text-3xl tw-font-bold tw-mb-2 tw-text-green-700">Verificar código</h1>
            <p className="tw-mb-8 tw-text-gray-600 tw-text-center">Ingresa el código de verificación enviado a tu correo</p>
            <form onSubmit={submitCodeToValidated} className="tw-w-full tw-max-w-md tw-space-y-5">
                <div>
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
                        className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-bold tw-py-3 tw-rounded-xl tw-w-full tw-transition tw-duration-200 tw-disabled:tw-opacity-50 tw-disabled:tw-cursor-not-allowed"
                        disabled={loading}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress size={24} color="inherit" />
                        </Box>
                    ) : (
                        "Validar código"
                    )}
                </button>
            </form>
        </>
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
        <>
            <h1 className="tw-text-3xl tw-font-bold tw-mb-2 tw-text-green-700">Nueva contraseña</h1>
            <p className="tw-mb-8 tw-text-gray-600 tw-text-center">Crea una nueva contraseña segura para tu cuenta</p>
            <form onSubmit={submitRecoverPassword} className="tw-w-full tw-max-w-md tw-space-y-5">
                <div>
                    <Input
                        label={"Nueva contraseña"}
                        type={"password"}
                        value={newPassword}
                        id={"new_password"}
                        name={"new_password"}
                        onChange={e => handleNewPasswordChanhe(e)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                </div>
                <div>
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
                <div className="tw-bg-gray-50 tw-p-4 tw-rounded-xl tw-mb-4">
                    <h3 className="tw-font-semibold tw-text-gray-700 tw-mb-3">Requerimientos de la contraseña:</h3>
                    <div className="tw-space-y-2">
                        <p className={`tw-flex tw-items-center tw-gap-2 ${newPassword.length >= min && newPassword.length <= max ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                            <span>{newPassword.length >= min && newPassword.length <= max ? '✓' : '✗'}</span>
                            Entre 6 y 16 caracteres
                        </p>
                        <p className={`tw-flex tw-items-center tw-gap-2 ${hasNumber ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                            <span>{hasNumber ? '✓' : '✗'}</span>
                            Al menos un número
                        </p>
                        <p className={`tw-flex tw-items-center tw-gap-2 ${hasSpecialChar ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                            <span>{hasSpecialChar ? '✓' : '✗'}</span>
                            Al menos un caracter especial
                        </p>
                        <p className={`tw-flex tw-items-center tw-gap-2 ${noHasSpace ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                            <span>{noHasSpace ? '✓' : '✗'}</span>
                            Sin espacios
                        </p>
                    </div>
                </div>
                <button type="submit"
                        className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-bold tw-py-3 tw-rounded-xl tw-w-full tw-transition tw-duration-200 tw-disabled:tw-opacity-50 tw-disabled:tw-cursor-not-allowed"
                        disabled={loading}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress size={24} color="inherit" />
                        </Box>
                    ) : (
                        "Cambiar contraseña"
                    )}
                </button>
            </form>
        </>
    );
}
