import React, { useEffect } from "react";
import { Event } from "../../../types/Event";
import EventCard from "../../../components/EventCard";
import { Avatar, Box, Button, Card, CardHeader, Grid, Typography } from "@mui/material";
import testParticipants from '../../../testData/participants.js'
import UserCard from "../../../components/UserCard";

type UpcomingEventDashboardProps = {
    event: Event
}

export default function UpcomingEventDashboard(props: UpcomingEventDashboardProps) {

    const [participants, setParticipants] = React.useState<any[]>([]);
    useEffect(() => {
        setParticipants(testParticipants.sort(() => Math.random() - 0.5));
    }, []);
    const openRegistration = () => {
        if (Math.abs(new Date() as any - (new Date(props.event.dateTime) as any)) > 60 * 60 * 1000) {
            if (!prompt('It is more than hour difference between now and event start, are you sure you want to start registration now?')) {
                return;
            }
        }
        window.location.reload();
    }

    return <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
            <EventCard event={props.event}>

                <Button variant="contained" color="success" onClick={openRegistration}>
                    Open event for registration
                </Button>
            </EventCard>
        </Grid>

        <Grid item xs={12} lg={6}>
            <Typography variant="h5">Registered participants ({participants.length})</Typography>

            <Grid container spacing={1}>
                {participants.map(p => <Grid key={p.nickname} item xs={12} sm={6} md={4} lg={6} xl={4} >
                    <UserCard title={p.name + '(' + p.nickname + ')'} subtitle={p.phone + ' | ' + p.email} />
                </Grid>)}
            </Grid>
        </Grid>
    </Grid>
}