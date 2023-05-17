import StartIcon from '@mui/icons-material/Start';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import UserCard from './UserCard';
import { Box, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Event } from '../types/Event';

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export const GameFinalComponent = (props: { event: Event, started: any, onClose: () => void}) => {
    const [time, setTime] = React.useState((new Date() as unknown as number - props.started || new Date().getTime()) / 1000);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime((new Date() as unknown as number - props.started || new Date().getTime()) / 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, [props.started]);

    return <Box padding={1}>
        <Grid container spacing={2}>
            <Grid item xs={12}>

                <Typography variant="h1">{formatTime(time)}</Typography>
                <Typography variant="body1">The final stage of the game requires the administrator to patiently wait until all users have completed and finalized their results before officially closing the game. It is a crucial step to ensure that all scores and points have been calculated accurately, and that no user is left behind. The administrator must exercise caution and precision during this phase, as any discrepancies or miscalculations could result in unfair outcomes or unresolved tensions. Once all users have completed their tasks, the administrator can confidently close the game, bringing it to a successful conclusion.</Typography>
                <Box marginTop={2}>
                    <Button onClick={props.onClose} variant='contained' color='success' startIcon={<DoneOutlineIcon />}>Close game</Button>
                </Box>
            </Grid>
        </Grid>
    </Box >

}

export const GameComponent = (props: {
    event: Event,
    next: Function,
    started: any, round: any, isFinal: boolean, rounds: number, currentRoundIndex: number
}) => {

    const nextButton = props.isFinal
        ? <Button onClick={() => props.next()} variant='contained' color='success' startIcon={<DoneOutlineIcon />}>Final</Button>
        : <Button onClick={() => props.next()} variant='contained' color='primary' startIcon={<StartIcon />}>Next round</Button>;

    const [time, setTime] = React.useState((new Date() as unknown as number - props.started || new Date().getTime()) / 1000);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime((new Date() as unknown as number - props.started || new Date().getTime()) / 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, [props.started]);

    return <Box padding={1}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5" marginBottom={1}>Round {props.currentRoundIndex + 1} of {props.rounds}</Typography>
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item>
                        <Typography variant="h1">{formatTime(time)}</Typography>
                    </Grid>
                    <Grid item>
                        {nextButton}
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h5">Table name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h5">Player 1</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h5">Player 2</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {props.round && props.round.map((t: { [key: string]: any }, i: number) => <TableRow key={t.table}>
                            <TableCell>
                                <Typography variant="caption">Table {i + 1}: {t.table}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="caption">{t.player1.name} ({t.player1.nickname})</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="caption">{t.player2.name} ({t.player2.nickname})</Typography>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </Grid>

            <Grid item xs={12}>{nextButton}</Grid>
        </Grid>
    </Box>;
}

export const ParticipantsComponent = (props: { event: Event, participants: any[] }) => <Grid container spacing={1}>
    {props.participants.map(p => <Grid key={p.id} item xs={12} sm={6} md={4} lg={6} xl={4} >
        <UserCard title={p.name + '(' + p.nickname + ')'} subtitle={p.phone + ' | ' + p.email} />
    </Grid>)}
</Grid>

export const TablesComponent = (props: { event: Event, tables: any[] }) => <Grid container spacing={1}>
    {props.tables.map((t, i) => <Grid key={t.id} item xs={12} sm={6} md={4} lg={6} xl={4} >
        <Card>
            <CardContent>
                <Typography variant="h5">Table {i + 1}: {t.title}</Typography>
            </CardContent>
        </Card>
    </Grid>)}
</Grid>
