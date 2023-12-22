import {AuthInterface,
        InitialStatePlanInterface,
		InitialStateContentInterface,
		InitialStateUnitInterface,
		InitialStateEvidenceInterface,
		InitialStateChartInterface
} from '@/interfaces';

export const setToken = (tokenInfo: AuthInterface) => {
    localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
};

export const getToken = () => {
    return JSON.parse(localStorage.getItem('tokenInfo') ?? 'null');
};

export const removeToken = () => {
    localStorage.removeItem('tokenInfo');
};

export const setGenericState = (
	name: string, 
	genericState: 	InitialStateChartInterface |
					InitialStateContentInterface |
					InitialStateEvidenceInterface |
					InitialStatePlanInterface |
					InitialStateUnitInterface
	) => {
	localStorage.setItem(name, JSON.stringify(genericState));
};

export const getGenericState = (name: string) => {
	return JSON.parse(localStorage.getItem(name) ?? 'null');
};

export const removeGenericState = (name: string) => {
	localStorage.removeItem(name);
};
