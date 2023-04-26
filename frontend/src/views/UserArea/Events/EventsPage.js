import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { testNewEvents, testPastEvents, testUpcomingEvents } from "../../../testData/events";
import { AttendedEventCard, ListEventCard, UpcomingEventCard } from "./EventCards";

export default function EventsPage() {

    const [tab, setTab] = useState(0);
    const [newEvents, setNewEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    useEffect(() => {
        setNewEvents(testNewEvents);
        setUpcomingEvents(testUpcomingEvents);
        setPastEvents(testPastEvents);
    }, [])

    const grid = (element) => <Grid item xs={12} xl={3} lg={4} md={6}>{element} </Grid>;

    const onRegister = (e) => {
        // TODO register on event
        setUpcomingEvents([...upcomingEvents, e]);
        setTab(1);
    }

    const onStart = (e) => {
        // TODO start event
        console.log('Starting event', e);
    }

    const onCancel = (e) => {
        // TODO cancel event
        setUpcomingEvents(upcomingEvents.filter(ee => ee.id !== e.id));
    }

    const onOpen = (e) => {
        // TODO open event page
        console.log('Open event page', e);
    }

    const AvailableEvents = () => newEvents.map(e => <ListEventCard event={e} onRegister={() => onRegister(e)} />).map(grid);
    const MyUpcomingEvents = () => upcomingEvents.map(e => <UpcomingEventCard event={e} onStart={() => onStart(e)} onCancel={() => onCancel(e)} />).map(grid);
    const AttendedByMeEvents = () => pastEvents.map(e => <AttendedEventCard event={e} onOpen={() => onOpen(e)} />).map(grid);

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