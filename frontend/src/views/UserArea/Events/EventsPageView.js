import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { testNewEvents, testPastEvents, testUpcomingEvents } from "../../../testData/events";
import { AttendedEventCard, ListEventCard, UpcomingEventCard } from "./EventCards";

export default function EventsPageView({ available, upcoming, past, onRegister, onCancel }) {

    const [tab, setTab] = useState(0);
    const [newEvents, setNewEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    const grid = (element) => <Grid item xs={12} xl={3} lg={4} md={6}>{element} </Grid>;

    const onClickRegister = (e) => {
        // TODO register on event
        onRegister(e);
        setTab(1);
    }

    const onStart = (e) => {
        // TODO start event
        console.log('Starting event', e);
    }

    const onOpen = (e) => {
        // TODO open event page
        console.log('Open event page', e);
    }

    
    const AvailableEvents = () => available.map(e => <ListEventCard key={e.id} event={e} onRegister={() => onClickRegister(e)} />).map(grid);
    const MyUpcomingEvents = () => upcoming.map(e => <UpcomingEventCard key={e.id} event={e} onStart={() => onStart(e)} onCancel={() => onCancel(e)} />).map(grid);
    const AttendedByMeEvents = () => past.map(e => <AttendedEventCard key={e.id} event={e} onOpen={() => onOpen(e)} />).map(grid);

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