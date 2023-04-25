import React from "react";
import { Button, Card, CardActions, CardContent, Divider, Grid, IconButton, Link, Typography } from "@mui/material";
import { Event } from "../types/Event";
import { LocationOn } from '@mui/icons-material';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminEventCard({ event }: { event: Event }) {

    const draftAlert = <Grid container>
        <WarningIcon color="warning" fontSize="small" style={{ marginRight: '5px' }} />
        <Typography variant="caption" style={{ verticalAlign: 'middle' }} color={'orange'}>
            Draft event, not published
        </Typography>
    </Grid>;

    return <Card>
        <CardContent>
            <Typography variant="caption">{event.dateTime.toLocaleString()}</Typography>
            <Typography variant="h4">{event.title}</Typography>
            {event.isDraft ? draftAlert : null}
            <Divider style={{ margin: '10px 0' }} />
            <Typography variant="body2">{event.description}</Typography>

            <Grid container spacing={1} marginTop={1}>
                <Grid item alignItems={'center'} >
                    <Grid container>
                        <LocationOn color="primary" fontSize="small" style={{ marginRight: '5px' }} />
                        <Typography variant="caption" style={{ verticalAlign: 'middle' }}>
                            {event.location}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item>
                    <Grid container>
                        <PriceChangeIcon color="success" fontSize="small" style={{ marginRight: '5px' }} />
                        <Typography variant="caption" style={{ verticalAlign: 'middle' }}>
                            {event.price} HUF
                        </Typography>
                    </Grid>

                </Grid>

                <Grid item>
                    <Grid container>
                        <PeopleAltIcon color="info" fontSize="small" style={{ marginRight: '5px' }} />
                        <Typography variant="caption" style={{ verticalAlign: 'middle' }}>
                            {event.participantCount} / {event.participantLimit}
                        </Typography>
                    </Grid>

                </Grid>
            </Grid>

        </CardContent>


        <CardActions>
            <Grid container justifyContent={'space-between'}>
                <Button size="small" color="primary" href={`/admin/events/${event.id}`}>
                    Open Dashboard
                </Button>

                <Grid item>
                    <Link href={`/admin/events/${event.id}/edit`}>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Link>

                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>

        </CardActions>
    </Card>
}