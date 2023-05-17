import { createSlice } from '@reduxjs/toolkit'
import { getAuthHeaders } from './user';
import { HOST } from '../services/api';
import { Event } from '../types/Event';
import { fetchEventGame } from './adminGame';

const adminEventsSlice = createSlice({
    name: 'adminEvents',
    initialState: {
        events: [],
        dashboard: null,
        lastValidation: null,
    },
    reducers: {
        setEvents(state, { payload }) {
            state.events = payload || [];
        },
        setDashboard(state, { payload }) {
            state.dashboard = payload;
        },
        setLastValidation(state, { payload }) {
            state.lastValidation = payload;
        },
        dropValidation(state) {
            state.lastValidation = null;
        }
    },
})

export const fetchEvents = () => (dispatch: Function) => {
    return fetch(`${HOST}/events/viewable`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders(),
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {
            dispatch(adminEventsSlice.actions.setEvents(json));
        })
        .catch(err => {
            console.error(err);
        });
}

export const deleteEvent = (id: number) => (dispatch: Function) => {

    return fetch(`${HOST}/events/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders(),
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dispatch(fetchEvents());
        })
        .catch(err => {
            console.error(err);
        });
}

export const createEvent = (event: Omit<Event, 'id'>) => (dispatch: Function) => {
    return fetch(`${HOST}/events`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: new URLSearchParams(event as any),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dispatch(fetchEvents());
        })
        .catch(err => {
            console.error(err);
        });
}

export const updateEvent = (event: Event) => (dispatch: Function) => {

    return fetch(`${HOST}/events/${event.id}`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: new URLSearchParams(event as any),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dispatch(fetchEvents());
        })
        .catch(err => {
            console.error(err);
        });
}

export const fetchEventDashboard = (id: number | string) => (dispatch: Function) => {
    return fetch(`${HOST}/events/${id}/dashboard`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders(),
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {
            dispatch(adminEventsSlice.actions.setDashboard(json));
        })
        .catch(err => {
            console.error(err);
        });
}

export const openEvent = (id: number | string) => (dispatch: Function) => {
    return fetch(`${HOST}/events/${id}`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: new URLSearchParams({
            status: 'OPEN',
        }),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dispatch(fetchEventDashboard(id));
        })
        .catch(err => {
            console.error(err);
        });
}

export const validateRegistration = (
    eventId: number | string,
    userId: number | string,
    pin: string,
) => (dispatch: Function) => {

    dispatch(adminEventsSlice.actions.setLastValidation({
        userId,
        eventId,
        pin,
        isValid: null,
    }));

    return fetch(`${HOST}/events/${eventId}/registration/validate/${userId}/${pin}`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders(),
        }
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        
        return res.json()
    })
    .then((json: any) => {
        dispatch(adminEventsSlice.actions.setLastValidation({
            userId,
            eventId,
            pin,
            isValid: json.valid,
        }));
    })
    .catch(err => { console.error(err); });
}

export const enrollRegistration = (
    eventId: number | string,
    userId: number | string,
    pin: string,
) => (dispatch: Function) => {
    return fetch(`${HOST}/events/${eventId}/registration/validate/${userId}/${pin}`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        dispatch(fetchEventDashboard(eventId));
    })
}

export const unEnrollRegistration = (
    eventId: number | string,
    userId: number | string,
) => (dispatch: Function) => {
    return fetch(`${HOST}/events/${eventId}/participation/${userId}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders(),
        },
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        dispatch(fetchEventDashboard(eventId));
    })
}

export const startGame = (eventId: number | string) => (dispatch: Function) => {

    return fetch(`${HOST}/games/start`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: new URLSearchParams({ eventId: eventId.toString() }),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dispatch(fetchEventDashboard(eventId));
            dispatch(fetchEventGame(eventId));
        })
        .catch(err => {
            console.error(err);
        });
}

export const { dropValidation } = adminEventsSlice.actions;

export default adminEventsSlice;