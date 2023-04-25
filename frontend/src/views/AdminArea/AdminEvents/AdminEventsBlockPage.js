import { Grid, Typography } from "@mui/material"
import AdminEventCard from "../../../components/AdminEventCard.tsx"
import events from "../../../testData/events.ts"
import { Fragment } from "react"

export default function AdminEventsBlockPage() {

    return <>
        <Typography variant="h4" marginBottom={4}>Admin Events Block Page</Typography>


        <Grid container spacing={2} justifyContent={'start'} textAlign={'start'}>
            {events.map(event => <Fragment key={event.id}>
                <Grid item lg={4} md={6} xs={12}>
                    <AdminEventCard event={event} />
                </Grid>
            </Fragment>)}
        </Grid>
    </>
}