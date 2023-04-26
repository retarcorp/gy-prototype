import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import AdminEventCard from "./AdminEventCard.tsx";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AdminManageEventPage() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0].toString());
    const [time, setTime] = useState('');
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState('');
    const [participantLimit, setParticipantLimit] = useState(0);
    const [isDraft, setIsDraft] = useState(false);

    const h = (v, setV) => ({ value: v, onChange: (e) => setV(e.target.value) })

    return <Box sx={{maxWidth: '900px', margin: '0 auto'}}>
        <Box>
            <Button variant="text" color="secondary" startIcon={<ArrowBackIcon/>} href="/admin/events/">Back</Button>
        </Box>
        <Typography variant="h4" marginBottom={3} textAlign={'center'} >Add/Edit Event</Typography>
        <FormGroup>
            <Grid container spacing={2} justifyContent={'start'} textAlign={'start'}>
                <Grid item xl={6} xs={12}>
                    <TextField fullWidth label='Event Title' {...h(title, setTitle)}></TextField>
                </Grid>

                <Grid item lg={6} xs={12}>
                    <TextField fullWidth multiline rows={6} label='Event Description' {...h(description, setDescription)} />
                </Grid>

                <Grid item lg={6} xs={12}>
                    <TextField fullWidth label='Event Location' {...h(location, setLocation)} />
                </Grid>

                <Grid item lg={6} xs={12}>
                    <TextField fullWidth label='Event Price' type="number" {...h(price, setPrice)}></TextField>
                </Grid>

                <Grid item lg={6} xs={12}>
                    <TextField fullWidth label='Event Participant Limit' type="number" {...h(participantLimit, setParticipantLimit)}></TextField>
                </Grid>

                <Grid item lg={6} xs={12} container spacing={2}>
                    <Grid item xs={6}>
                        <TextField fullWidth label='Event Date' type="date" {...h(date, setDate)}></TextField>

                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth label='Event Date' type="time" {...h(time, setTime)}></TextField>
                    </Grid>
                </Grid>

                <Grid item lg={6} xs={12}>

                    <FormControlLabel
                        color="primary"
                        control={<Checkbox onChange={(e, v) => setIsDraft(e.target.checked)} checked={isDraft} />}
                        label="Draft event (not visible to users)"
                    />

                </Grid>

                <Grid xs={12} item>
                    <Typography variant="h6">Event Preview</Typography>
                    <AdminEventCard
                        preview
                        event={{
                            id: 1,
                            title: title || 'Unnamed event',
                            dateTime: new Date(date + ' ' + time),
                            description: description,
                            location: location || 'Location not specified',
                            price: price,
                            participantLimit: participantLimit,
                            participantCount: 0,
                            isDraft: isDraft,
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12} container justifyContent={'space-between'}>
                    <Button variant="contained" color="primary">Save</Button>
                    <Button variant="text" color="error">Cancel</Button>
                </Grid>

            </Grid>
        </FormGroup>
    </Box>
}