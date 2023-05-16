import React from "react";
import { Button, Grid, IconButton, Link } from "@mui/material";
import { Event } from "../../../types/Event";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventCard from "../../../components/EventCard";    

export default function AdminEventCard({ event, preview = false, ...props }: any & { event: Event; preview: boolean }) {

    return <EventCard event={event}>

        {!preview ? <>
                <Grid container justifyContent={'space-between'}>
                    <Button size="small" color="primary" href={`/admin/events/${event.id}`}>
                        Open Dashboard
                    </Button>

                    <Grid item>
                        <Link href={`/admin/events/edit/${event.id}`}>
                            <IconButton>
                                <EditIcon/>
                            </IconButton>
                        </Link>

                        <IconButton onClick={() => props.onDelete(event)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
        </> : null}
    </EventCard>
}