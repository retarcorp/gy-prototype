import { createSlice } from '@reduxjs/toolkit'
import { getAuthHeaders } from './user';

const userEventsSlice = createSlice({
    name: 'userEvents',
    initialState: {
        availableEvents: [],
        upcomingEvents: [],
        participatedEvents: []
    },
    reducers: {
        setAvailableEvents(state, { payload }) {
            state.availableEvents = payload || [];
        },
        setUpcomingEvents(state, { payload }) {
            state.upcomingEvents = (payload || []).map(e => e.event)
        },
        setParticipatedEvents(state, { payload }) {
            state.participatedEvents = (payload || []);
        }
    }
})

const getEvents = (url: string, action: Function, d = (j: any) => j) => (dispatch: Function) => {
    return fetch(url, {
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
            dispatch(action(d(json)));
        })
        .catch(err => {
            console.error(err);
        });
}

export const loadUserEvents = () => (dispatch: Function) => {
    return getEvents('http://localhost:8000/events/available', userEventsSlice.actions.setAvailableEvents)(dispatch);
}

export const loadUpcomingEvents = () => (dispatch: Function) => {
    return getEvents('http://localhost:8000/events/registered', userEventsSlice.actions.setUpcomingEvents)(dispatch);
}

export const getParticipatedEvents = () => (dispatch: Function) => {
    return getEvents('http://localhost:8000/events/participated', userEventsSlice.actions.setParticipatedEvents)(dispatch);
}

export const loadAllEvents = () => (dispatch: Function) => {
    return [loadUserEvents(), loadUpcomingEvents(), getParticipatedEvents()].map(f => f(dispatch)); 
}

export const registerOnEvent = (e: any) => (dispatch: Function) => {
    return fetch(`http://localhost:8000/events/${e.id}/registration`, {
        method: 'POST',
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
            dispatch(loadAllEvents());
        })
        .catch(err => {
            console.error(err);
        });
}

export const unregisterFromEvent = (e: any) => (dispatch: Function) => {
    return fetch(`http://localhost:8000/events/${e.id}/registration`, {
        method: 'DELETE',
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
        .then(() => {
            dispatch(loadAllEvents());
        })
        .catch(err => {
            console.error(err);
        });
}

const { actions } = userEventsSlice;

// export const { logIn } = userSlice.actions;
export const { } = userEventsSlice.actions;

export default userEventsSlice;