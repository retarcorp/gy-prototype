import React from "react";
import { Event } from "../../../types/Event";
import EventCard from "../../../components/EventCard";
import { Button, Grid, Typography } from "@mui/material";
import UserCard from "../../../components/UserCard";

type UpcomingEventDashboardProps = {
    event: Event
    registrations?: any[]
    onOpenRegistration: () => void
}

export default function UpcomingEventDashboard(props: UpcomingEventDashboardProps) {

    const registrations = props.registrations || [];

    const openRegistration = () => {
        props.onOpenRegistration();   
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
            <Typography variant="h5">Registered: ({registrations.length})</Typography>

            <Grid container spacing={1}>
                {registrations.map(p => <Grid key={p.id} item xs={12} sm={6} md={4} lg={6} xl={4} >
                    <UserCard title={p.name + '(' + p.nickname + ')'} subtitle={p.phone + ' | ' + p.email} />
                </Grid>)}
            </Grid>
        </Grid>
    </Grid>
}