import React, { useEffect } from 'react';
import { Event } from '../../../types/Event';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import EventCard from '../../../components/EventCard';
import testParticipants from '../../../testData/participants.js'
import colors from '../../../testData/colors.js';
import { GameComponent, ParticipantsComponent, TablesComponent } from '../../../components/RunningGameComponents';

type RunningEventDashboardProps = {
    event: Event
}

export default function RunningEventDashboard(props: RunningEventDashboardProps) {

    const [participants, setParticipants] = React.useState<any[]>([]);
    const [tables, setTables] = React.useState<any[]>([]);
    const [started, setStarted] = React.useState<any>(null);
    const [round, setRound] = React.useState<any>(null);

    useEffect(() => {
        const initialParticipants = testParticipants.sort(() => Math.random() - 0.5);
        setParticipants(initialParticipants);

        const initialTables = testParticipants.map(() => colors[Math.floor(Math.random() * colors.length)]) as string[];
        setTables(initialTables);
        setStarted(new Date());
        setRound(initialTables.map((t: string) => ({
            table: t,
            player1: initialParticipants[Math.floor(Math.random() * participants.length)],
            player2: initialParticipants[Math.floor(Math.random() * participants.length)],
        })));
    }, []);
    const [currentTab, setCurrentTab] = React.useState(0);

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
                    {currentTab === 0 && <GameComponent {...props} started={started} round={round}/>}
                    {currentTab === 1 && <ParticipantsComponent {...props} participants={participants} />}
                    {currentTab === 2 && <TablesComponent {...props} tables={tables}></TablesComponent>}
                </Box>
            </Grid>
        </Grid>

    </Box>
}