import React, { useEffect } from 'react';
import { Event } from '../../../types/Event';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import EventCard from '../../../components/EventCard';
import testParticipants from '../../../testData/participants.js'
import colors from '../../../testData/colors.js';
import { GameComponent, GameFinalComponent, ParticipantsComponent, TablesComponent } from '../../../components/RunningGameComponents';


export default function EventFinalDashboard(props: {event: Event}) {

    const [participants, setParticipants] = React.useState<any[]>([]);
    const [tables, setTables] = React.useState<any[]>([]);
    const [started, setStarted] = React.useState<any>(null);

    useEffect(() => {
        const initialParticipants = testParticipants.sort(() => Math.random() - 0.5);
        setParticipants(initialParticipants);

        const initialTables = testParticipants.map(() => colors[Math.floor(Math.random() * colors.length)]) as string[];
        setTables(initialTables);
        setStarted(new Date());
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
                    {currentTab === 0 && <GameFinalComponent {...props} started={started} />}
                    {currentTab === 1 && <ParticipantsComponent {...props} participants={participants} />}
                    {currentTab === 2 && <TablesComponent {...props} tables={tables}></TablesComponent>}
                </Box>
            </Grid>
        </Grid>

    </Box>
}