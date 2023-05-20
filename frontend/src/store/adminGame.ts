import { createSlice } from "@reduxjs/toolkit";
import { HOST } from "../services/api";
import { getAuthHeaders } from "./user";
import { fetchEventDashboard } from "./adminEvents";

const adminGameSlice = createSlice({
    initialState: {
        game: null,
        setup: null,
    },
    name: 'adminGame',
    reducers: {
        setGame(state, { payload }) {
            console.log(payload);
            state.game = payload;
        },
        setGameSetup(state, { payload }) {
            state.setup = payload;
        }
    }
})

export const fetchGameSetup = (gameId: number | string) => (dispatch: Function) => {
    fetch(`${HOST}/games/${gameId}/setup`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders()
        },
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(json => {
        dispatch(adminGameSlice.actions.setGameSetup(json));
    });
}

export const fetchEventGame = (eventId: number | string) => (dispatch: Function) => {
    fetch(`${HOST}/games/event/${eventId}`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders()
        },
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(json => {
        dispatch(adminGameSlice.actions.setGame(json));
        dispatch(fetchGameSetup(json.id));
    });
}

export const nextRound = (gameId: number | string, eventId: number | string) => (dispatch: Function) => {
    fetch(`${HOST}/games/${gameId}/round/next`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders()
        },
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(json => {
        dispatch(fetchGameSetup(gameId));
        dispatch(fetchEventDashboard(eventId))
    });
}

export const closeGame = (gameId: number | string, eventId: number | string) => (dispatch: Function) => {
    fetch(`${HOST}/games/${gameId}/close`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders()
        },
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(json => {
        dispatch(fetchGameSetup(gameId));
        dispatch(fetchEventDashboard(eventId))
    });
}


export default adminGameSlice;