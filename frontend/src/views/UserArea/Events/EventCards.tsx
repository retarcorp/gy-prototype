import React from "react";
import EventCard from "../../../components/EventCard";
import { Button, Grid } from "@mui/material";

export function ListEventCard(props: any & {onRegister: Function}): JSX.Element {

    return <EventCard {...props}>
        <Grid container>
            <Grid item>
                <Button variant="text" color="primary" size="small" onClick={props.onRegister}>Register</Button>
            </Grid>
        </Grid>
    </EventCard>
}

export function UpcomingEventCard(props: any & {onStart: Function, onCancel: Function}): JSX.Element {

    return <EventCard {...props}>
        <Grid container justifyContent={'space-between'}>
            <Grid item>
                <Button variant="contained" color="primary" size="small" onClick={props.onStart}>Start event</Button>
            </Grid>
            <Grid item>
                <Button variant="text" color="error" size="small" onClick={props.onCancel}>Cancel participance</Button>
            </Grid>
        </Grid>
    </EventCard>
}

export function AttendedEventCard(props: any & {onOpen: Function}): JSX.Element {

    return <EventCard {...props}>
        <Grid container justifyContent={'space-between'}>
            <Grid item>
                <Button variant="contained" color="primary" size="small" onClick={props.onOpen}>Show event results</Button>
            </Grid>
        </Grid>
    </EventCard>
}