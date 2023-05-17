import React, { useEffect } from 'react';
import { Event } from '../../../types/Event';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import EventCard from '../../../components/EventCard';
import testParticipants from '../../../testData/participants.js'
import colors from '../../../testData/colors.js';
import { GameComponent, ParticipantsComponent, TablesComponent } from '../../../components/RunningGameComponents';

type RunningEventDashboardProps = {
    event: Event,
    game: any,
    onNextRound: Function,
}

export default function RunningEventDashboard(props: RunningEventDashboardProps) {

    const participants = props.game.participants;
    const participatedUsers = participants.map((p: any) => p.user);
    const tables = props.game.tables;
    const currentRound = props.game.rounds.find((r: any) => r.id === props.game.currentRoundId);
    
    const isFinalRound = currentRound.id === props.game.rounds[props.game.rounds.length - 1].id;
    const currentRoundIndex = props.game.rounds.indexOf(currentRound);

    const getTable = (id: any) => tables.find((t: any) => t.id === id);
    const getUser = (id: any) => participants.find((p: any) => p.id === id)?.user;

    const [started, setStarted] = React.useState<any>(null);
    const [roundRenderData, setRoundRenderData] = React.useState<any>(null);
    

    useEffect(() => {
        setStarted(new Date());
        const arrangements = props.game.tableArrangements.filter((a: any) => a.roundId === currentRound.id);

        const renderData = arrangements.map((a: any) => ({
            table: getTable(a.tableId).title,
            player1: getUser(a.participantAId),
            player2: getUser(a.participantBId),
        }));
        setRoundRenderData(renderData);
    }, [currentRound]);

    const [currentTab, setCurrentTab] = React.useState(1);

    return <Box>
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <EventCard event={props.event} />
            </Grid>

            <Grid item xs={12} lg={6}>
                <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
                    <Tab label="Game" />
                    <Tab label="Participants" />
                    <Tab label="Tables" />
                </Tabs>

                <Box>
                    {currentTab === 0 && <GameComponent next={props.onNextRound} {...props} started={started} round={roundRenderData} isFinal={isFinalRound} rounds={props.game.rounds.length} currentRoundIndex={currentRoundIndex}/>}
                    {currentTab === 1 && <ParticipantsComponent {...props} participants={participatedUsers} />}
                    {currentTab === 2 && <TablesComponent {...props} tables={tables}></TablesComponent>}
                </Box>
            </Grid>
        </Grid>

    </Box>
}