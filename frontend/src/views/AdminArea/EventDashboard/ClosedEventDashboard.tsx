import React, { useEffect } from 'react';
import { Event } from '../../../types/Event';
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import EventCard from '../../../components/EventCard';
import testParticipants from '../../../testData/participants.js'
import { ParticipantsComponent } from '../../../components/RunningGameComponents';


export default function ClosedEventDashboard(props: { event: Event }) {

    const [participants, setParticipants] = React.useState<any[]>([]);

    useEffect(() => {
        const initialParticipants = testParticipants.sort(() => Math.random() - 0.5);
        setParticipants(initialParticipants);
    }, []);
    const [currentTab, setCurrentTab] = React.useState(0);

    return <Box>
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <EventCard event={props.event} />
            </Grid>

            <Grid item xs={12} lg={6}>
                <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
                    <Tab label="Results" />
                    <Tab label="Participants" />
                </Tabs>

                <Box>
                    {currentTab === 0 && <Box padding={2}>
                        <Typography variant='body1'>Game closed! Thank you for playing!</Typography>
                    </Box>}
                    {currentTab === 1 && <ParticipantsComponent {...props} participants={participants} />}
                </Box>
            </Grid>
        </Grid>

    </Box>
}