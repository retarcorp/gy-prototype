import React, { useEffect } from 'react';
import { Event } from '../../../types/Event';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import EventCard from '../../../components/EventCard';
import { GameFinalComponent, ParticipantsComponent, TablesComponent } from '../../../components/RunningGameComponents';

export default function EventFinalDashboard(props: { event: Event, game: any, onClose: () => void }) {

    const tables = props.game.tables;
    const participants = props.game.participants.map(p => p.user);

    const [started, setStarted] = React.useState<any>(null);

    useEffect(() => { setStarted(new Date()); }, []);
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
                    {currentTab === 0 && <GameFinalComponent onClose={props.onClose} event={props.event} started={started} />}
                    {currentTab === 1 && <ParticipantsComponent {...props} participants={participants} />}
                    {currentTab === 2 && <TablesComponent {...props} tables={tables}></TablesComponent>}
                </Box>
            </Grid>
        </Grid>

    </Box>
}