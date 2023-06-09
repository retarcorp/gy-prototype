import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { testNewEvents, testPastEvents, testUpcomingEvents } from "../../../testData/events";
import { AttendedEventCard, ListEventCard, UpcomingEventCard } from "./EventCards";

export default function EventsPageView({ available, upcoming, past, onRegister, onCancel }) {

    const [tab, setTab] = useState(0);
    const [newEvents, setNewEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);


    const onClickRegister = (e) => {
        // TODO register on event
        onRegister(e);
        setTab(1);
    }

    const onStart = (e) => {
        window.location.href = `/user/events/${e.id}`;
    }

    const onOpen = (e) => {
        // TODO open event page
        if (e.status === 'CLOSED') {
            return window.location.href = `/user/events/${e.id}/results`;

        }
        window.location.href = `/user/events/${e.id}`;
    }

    const grid = (element, key) => <Grid key={key} item xs={12} xl={3} lg={4} md={6}>{element} </Grid>;
    const AvailableEvents = () => available.map(e => grid(<ListEventCard event={e} onRegister={() => onClickRegister(e)} />, e.id))
    const MyUpcomingEvents = () => upcoming.map(e => grid(<UpcomingEventCard event={e} onStart={() => onStart(e)} onCancel={() => onCancel(e)} />, e.id));
    const AttendedByMeEvents = () => past.map(e => grid(<AttendedEventCard event={e} onOpen={() => onOpen(e)} />, e.id));

    return <Box>
        <Tabs onChange={(e, v) => setTab(v)} value={tab}>
            <Tab label="Available" />
            <Tab label="My upcoming" />
            <Tab label="Attended by me" />
        </Tabs>

        <Grid container spacing={2}>
            {tab === 0 ? <AvailableEvents /> : null}
            {tab === 1 ? <MyUpcomingEvents /> : null}
            {tab === 2 ? <AttendedByMeEvents /> : null}
        </Grid>

    </Box>
}