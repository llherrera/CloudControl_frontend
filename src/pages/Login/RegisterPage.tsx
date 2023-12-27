import React, { useEffect } from 'react';
import { Frame, RegisterForm } from '../../components';

import { useAppSelector, useAppDispatch } from '@/store';
import { setIdPlan } from '@/store/content/contentSlice';

export const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const { plan } = useAppSelector(state => state.plan);
    let id_ = 0;

    useEffect(() => {
        if (plan === undefined) return;
        dispatch(setIdPlan(id_));
        id_ = plan.id_plan!;
    }, []);

    return (
        <Frame data={
            <RegisterForm id={id_}/>
        }/>
    );
}