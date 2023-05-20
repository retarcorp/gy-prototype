import { useParams } from "react-router";
import withUserAuthWrapper from "../withUserAuthWrapper"
import withUserWrapper from "../withUserWrapper"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentGameRoundSetup, fetchParticipation, fetchPreliminaryResults, updateOpitionEntries } from "../../../store/userEvents";
import React from 'react';
import EventParticipance from "./EventParticipance";
import EventFinal from "./EventFinal";

const debounce = (func: any, wait: number) => {
    let timeout: any;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const UserGamePage = () => {
    const eventId = parseInt(useParams().id as string);
    const dispatch = useDispatch();

    const lastParticipation = useSelector((state: any) => state.userEvents.participation);
    const participation = lastParticipation?.eventId === eventId ? lastParticipation : null;

    const gameSetup = useSelector((state: any) => state.userEvents.currentGameRoundSetup);
    const gameStatus = gameSetup ? gameSetup.status : null;
    const isGameRunning = gameStatus === 'RUNNING';
    const tableName = isGameRunning ? (gameSetup.tables.find(({ id }) => id === gameSetup.currentArrangement.tableId).title) : null;

    const preliminaryResults = useSelector((state: any) => state.userEvents.gamePreliminaryResults);

    useEffect(() => {
        dispatch<any>(fetchParticipation(eventId))
    }, [])

    useEffect(() => {
        if (participation?.gameId) {
            const pollInterval = setInterval(() => {
                dispatch<any>(fetchCurrentGameRoundSetup(participation.gameId))
            }, 5000);
            dispatch<any>(fetchCurrentGameRoundSetup(participation.gameId))
            return () => clearInterval(pollInterval);
        }
    }, [participation?.gameId])

    useEffect(() => {
        if (gameStatus === 'FINAL') {
            dispatch<any>(fetchPreliminaryResults(participation.gameId));
        }
    }, [gameStatus])

    const onSaveResults = (entries: any[]) => {
        dispatch<any>(updateOpitionEntries(participation.gameId, entries));
    }
    const debouncedSaveResults = React.useCallback(debounce(onSaveResults, 500), []);

    // TODO save likes and notes for user

    const statusRender = (status: string) => {
        switch (status) {
            case 'RUNNING': return <EventParticipance 
                tableName={tableName} 
                roundCount={gameSetup.roundCount} 
                currentRoundDisplayIndex={gameSetup.index + 1} 
                partner={gameSetup.currentArrangement.partner} 
                onUpdateResultsEntry={(e) => debouncedSaveResults([e])}
            />;
            case 'FINAL': return preliminaryResults ? <EventFinal likes={preliminaryResults.likes} notes={preliminaryResults.notes} partners={preliminaryResults.participatedUsers} onSave={onSaveResults}/> : 'Loading results...';
            default: return 'Unknown game status'
        }
    }

    return <>
        {gameSetup ? statusRender(gameSetup.status) : null}
    </>

}

export default withUserAuthWrapper(withUserWrapper(UserGamePage));