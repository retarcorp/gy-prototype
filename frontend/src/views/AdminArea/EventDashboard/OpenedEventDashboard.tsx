import React, { useEffect } from 'react';
import EventCard from '../../../components/EventCard';
import { Event } from "../../../types/Event";
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid, IconButton, TextField, Typography } from '@mui/material';
import UserCard from '../../../components/UserCard.tsx';
import testParticipants from '../../../testData/participants.js'
import LoginIcon from '@mui/icons-material/Login';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type OpenedEventDashboardProps = {
    event: Event;
}

export default function OpenedEventDashboard(props: OpenedEventDashboardProps) {
    const [participants, setParticipants] = React.useState<any[]>([]);
    const [registrants, setRegistrants] = React.useState<any[]>([]);

    useEffect(() => {
        const shuffled = testParticipants.sort(() => Math.random() - 0.5);
        setParticipants(shuffled.slice(0, 10));
        setRegistrants(shuffled.slice(10));
    }, []);

    const [open, setOpen] = React.useState(false);
    const [currentParticipant, setCurrentParticipant] = React.useState<any>(null);
    const onTryEnroll = (p: any) => {
        setOpen(true);
        setCurrentParticipant(p);
    }
    const enroll = () => {
        setOpen(false);
        setParticipants([...participants, currentParticipant]);
        setRegistrants(registrants.filter(r => r.nickname !== currentParticipant.nickname));
    }

    const unEnroll = (p: any) => {
        setRegistrants([...registrants, p]);
        setParticipants(participants.filter(r => r.nickname !== p.nickname));
    }


    return <Box>

        <Dialog open={open}>
            <DialogTitle>Enter PIN from his device:</DialogTitle>

            <Box padding={1}>
                <TextField label="PIN" variant="outlined" fullWidth type='number' />
                <Typography variant="caption">The PIN is displayed on the other device. You can also scan QR on user's device instead.</Typography>
            </Box>

            <DialogActions>
                <Button variant="contained" color="success" onClick={enroll}>Add</Button>
                <Button variant="contained" color="error" onClick={() => setOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>

        <Grid container spacing={2}>
            <Grid item xs={12} lg={6} xl={4}>
                <EventCard event={props.event}>
                    <Button variant="contained" color="success">Start game</Button>
                </EventCard>
            </Grid>

            <Grid item xs={12} lg={6} xl={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography variant="h5">Game participants ({participants.length})</Typography>

                        <Grid container spacing={1}>
                            {participants.map(p => <Grid key={p.nickname} item xs={12} sm={12} md={6} lg={12} xl={12} >
                                <UserCard title={p.name + '(' + p.nickname + ')'} subtitle={p.phone + ' | ' + p.email}>
                                    <IconButton onClick={() => unEnroll(p)}>
                                        <HighlightOffIcon />
                                    </IconButton>
                                </UserCard>
                            </Grid>)}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography variant="h5">Registrants ({registrants.length})</Typography>

                        <Grid container spacing={1}>
                            {registrants.map(p => <Grid key={p.nickname} item xs={12} sm={12} md={6} lg={12} xl={12} >
                                <UserCard title={p.name + '(' + p.nickname + ')'} subtitle={p.phone + ' | ' + p.email} >
                                    <IconButton onClick={() => onTryEnroll(p)}>
                                        <LoginIcon />
                                    </IconButton>
                                </UserCard>
                            </Grid>)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    </Box>;
}