import React from 'react';
import { useParams } from 'react-router-dom';
import { RegisterForm } from '../../components';

export const RegisterPage = () => {
    const { id } = useParams();

    return (
        <RegisterForm id={id}/>
    );
}