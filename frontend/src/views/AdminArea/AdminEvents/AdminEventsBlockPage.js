import { Button, Grid, Typography } from "@mui/material"
import AdminEventCard from "./AdminEventCard.tsx"
import { Fragment, useEffect } from "react"
import withAdminWrapper, { withAdminAuthWrapper } from "../AdminWrapper.js"
import { useDispatch, useSelector } from "react-redux"
import { deleteEvent, fetchEvents } from "../../../store/adminEvents.ts"

function AdminEventsBlockPage() {

    const events = useSelector(state => state.adminEvents.events)
        .map(event => ({ 
            ...event, 
            dateTime: new Date(event.datetime),
            isDraft: event.status === 'DRAFT'

        }));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchEvents());
    }, [])

    const onDelete = (event) => {
        dispatch(deleteEvent(event.id));
    }

    return <>
        <Typography variant="h4" marginBottom={4}>Admin Events Block Page</Typography>

        <Button variant="contained" color="primary" href="/admin/events/create">Create Event</Button>

        <Grid container spacing={2} justifyContent={'start'} textAlign={'start'}>
            {events.map(event => <Fragment key={event.id}>
                <Grid item lg={4} md={6} xs={12}>
                    <AdminEventCard event={event} onDelete={onDelete} />
                </Grid>
            </Fragment>)}
        </Grid>
    </>
}

export default withAdminAuthWrapper(withAdminWrapper(AdminEventsBlockPage));