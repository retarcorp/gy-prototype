import { createSlice } from '@reduxjs/toolkit'
import { HOST } from '../services/api';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        token: null,
        value: 0,
        isLoading: false,
        internalError: null as Error | null,
        isTokenChecked: false,
    },
    reducers: {
        setIsLoading(state, { payload }) {
            state.isLoading = payload.value;
        },
        setInternalError(state, { payload }) {
            state.internalError = payload;
        },
        setUserData(state, { payload }) {
            state.user = payload.user;
            state.token = payload.token;
            state.isTokenChecked = true;
            sessionStorage.setItem('token', payload.token);
        },
        setUser(state, { payload }) {
            state.user = payload;
        }
    }
})

export const getAuthHeaders = (): { [key: string]: string } => {
    const token = sessionStorage.getItem('token');

    if (token === null || token === 'null') {
        return {};
    }

    return {
        'Authorization': 'Bearer ' + token,
    };
}

const { actions } = userSlice;

export const signUp = (email: string, password: string) => (dispatch: Function) => {
    dispatch(userSlice.actions.setIsLoading({ value: true }));

    fetch(`${HOST}/users`, {
        method: 'POST',
        body: new URLSearchParams({ email, password })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {
            dispatch(actions.setUserData({ user: json.user, token: json.auth.token }));
            dispatch(userSlice.actions.setIsLoading({ value: false }));
        })
        .catch(err => {
            console.error(err);
            dispatch(actions.setIsLoading({ value: false }));
            dispatch(actions.setInternalError(err.message));
        });
}

export const signIn = (email: string, password: string) => (dispatch: Function) => {
    dispatch(userSlice.actions.setIsLoading({ value: true }));

    fetch(`${HOST}/users/signin`, {
        method: 'POST',
        body: new URLSearchParams({ email, password })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {
            dispatch(actions.setUserData({ user: json.user, token: json.auth.token }));
            dispatch(userSlice.actions.setIsLoading({ value: false }));

        })
        .catch(err => {
            console.error(err);
            dispatch(actions.setIsLoading({ value: false }));
            dispatch(actions.setInternalError(err.message));
        });

}

export const validateToken = () => (dispatch: Function) => {
    dispatch(userSlice.actions.setIsLoading({ value: true }));
    const token = sessionStorage.getItem('token');

    if (token === null || token === 'null') {

        dispatch(actions.setUserData({ user: null, token: null }));
        dispatch(userSlice.actions.setIsLoading({ value: false }));
        return;
    }

    fetch(`${HOST}/users/validate`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {
            if (json.valid) {
                dispatch(actions.setUserData({ user: json.user, token }));
            } else {
                dispatch(actions.setUserData({ user: null, token: null }));
            }
            dispatch(userSlice.actions.setIsLoading({ value: false }));
        })
        .catch(err => {
            dispatch(actions.setIsLoading({ value: false }));
            dispatch(actions.setInternalError(err.message));
        });
}

export const submitOnboarding = (onboardingData: { [key: string]: string }) => (dispatch: Function) => {
    dispatch(actions.setIsLoading({ value: true }));


    fetch(`${HOST}/users/onboarding`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: new URLSearchParams(onboardingData)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {

            dispatch(actions.setUser(json));
        })
        .catch(err => {
            console.error(err);
        })
        .finally(() => {
            dispatch(actions.setIsLoading({ value: false }));
        });
}

export const logOut = () => (dispatch: Function) => {
    dispatch(actions.setUserData({ user: null, token: null }));
}

// export const { logIn } = userSlice.actions;
export const { setIsLoading, setInternalError } = userSlice.actions;

export default userSlice;