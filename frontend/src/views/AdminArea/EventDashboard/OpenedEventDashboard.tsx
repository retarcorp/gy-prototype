import React, { useEffect } from 'react';
import EventCard from '../../../components/EventCard';
import { Event } from "../../../types/Event";
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid, IconButton, TextField, Typography } from '@mui/material';
import UserCard from '../../../components/UserCard.tsx';
import LoginIcon from '@mui/icons-material/Login';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type OpenedEventDashboardProps = {
    event: Event;
    registrations: any[];
    participants: any[];
    onEnroll: (p: any, pin: string) => void;
    onUnEnroll: (p: any) => void;
    onStartGame: Function;
}

export default function OpenedEventDashboard(props: OpenedEventDashboardProps) {
    const { participants, registrations: registrants } = props;

    const [open, setOpen] = React.useState(false);
    const [currentParticipant, setCurrentParticipant] = React.useState<any>(null);
    const [pin, setPin] = React.useState('');
    useEffect(() => {
        setPin('');
    }, [open]);

    const onTryEnroll = (p: any) => {
        setOpen(true);
        setCurrentParticipant(p);
    }
    const enroll = () => {
        setOpen(false);
        props.onEnroll(currentParticipant, pin);
    }

    const unEnroll = (p: any) => {
        props.onUnEnroll(p);
    }

    return <Box>

        <Dialog open={open}>
            <DialogTitle>Enter PIN from his device:</DialogTitle>

            <Box padding={1}>
                <TextField label="PIN" variant="outlined" fullWidth type='number' value={pin} onChange={(e) => setPin(e.target.value)}/>
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
                    <Button variant="contained" color="success" onClick={() => props.onStartGame()}>Start game</Button>
                </EventCard>
            </Grid>

            <Grid item xs={12} lg={6} xl={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography variant="h5">Game participants ({participants.length})</Typography>

                        <Grid container spacing={1}>
                            {participants.map(p => <Grid key={p.id} item xs={12} sm={12} md={6} lg={12} xl={12} >
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
                            {registrants.map(p => <Grid key={p.id} item xs={12} sm={12} md={6} lg={12} xl={12} >
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