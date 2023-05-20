import { createSlice } from '@reduxjs/toolkit'
import { getAuthHeaders } from './user';
import { HOST } from '../services/api';

const userEventsSlice = createSlice({
    name: 'userEvents',
    initialState: {
        availableEvents: [],
        upcomingEvents: [],
        participatedEvents: [],
        registrations: [],
        participation: null,
        // TODO extract to separate state module
        currentGameRoundSetup: null,
        gamePreliminaryResults: null,
        gameFullResults: null,
    },
    reducers: {
        setAvailableEvents(state, { payload }) {
            state.availableEvents = payload || [];
        },
        setUpcomingEvents(state, { payload }) {
            state.upcomingEvents = (payload || []).map(e => e.event)
        },
        setRegistrations(state, { payload }) {
            state.registrations = (payload || []);
            state.upcomingEvents = (payload || []).map(e => e.event)
        },
        setParticipatedEvents(state, { payload }) {
            state.participatedEvents = (payload || []).map(e => e.event);
        },
        setViewedParticipation(state, { payload }) {
            state.participation = payload;
        },
        setGameRoundSetup(state, { payload }) {
            state.currentGameRoundSetup = payload;
        },
        setGamePreliminaryResults(state, { payload }) {
            state.gamePreliminaryResults = payload;
        },
        setGameFullResults(state, { payload }) {
            state.gameFullResults = payload;
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

export const loadRegistrations = () => (dispatch: Function) => {
    return getEvents('http://localhost:8000/events/registered', userEventsSlice.actions.setRegistrations)(dispatch);
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

export const fetchParticipation = (eventId: number) => (dispatch: Function) => {
    return fetch(`${HOST}/events/${eventId}/participation/my/validate`, {
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
            if (json) {
                dispatch(userEventsSlice.actions.setViewedParticipation(json.participation));
                return json;
            }
        })
        .catch(err => {
            console.error(err);
        });
}

export const fetchCurrentGameRoundSetup = (gameId: number) => (dispatch: Function) => {
    return fetch(`${HOST}/games/${gameId}/round/current`, {
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
            if (json) {
                dispatch(userEventsSlice.actions.setGameRoundSetup(json));
                return json;
            }
        })
        .catch(err => {
            console.error(err);
        });
}

export const fetchPreliminaryResults = (gameId: number) => (dispatch: Function) => {
    return fetch(`${HOST}/games/${gameId}/results/preliminary`, {
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
            if (json) {
                dispatch(userEventsSlice.actions.setGamePreliminaryResults(json));
                return json;
            }
        })
        .catch(err => {
            console.error(err);
        });
}

export const updateOpitionEntries = (gameId: number, entries: any[]) => (dispatch: Function) => {
    return fetch(`${HOST}/games/${gameId}/results`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders(),
        },
        body: new URLSearchParams({ entries: JSON.stringify(entries)})
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {
            if (json) {
                dispatch(fetchPreliminaryResults(gameId));
                return json;
            }
        })
        .catch(err => {
            console.error(err);
        });
}

export const fetchEventResults = (eventId: number) => (dispatch: Function) => {
    return fetch(`${HOST}/events/${eventId}/results`, {
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
            if (json) {
                dispatch(userEventsSlice.actions.setGameFullResults(json));
                return json;
            }
        })
        .catch(err => {
            console.error(err);
        });
}

const { actions } = userEventsSlice;

// export const { logIn } = userSlice.actions;
export const { } = userEventsSlice.actions;

export default userEventsSlice;