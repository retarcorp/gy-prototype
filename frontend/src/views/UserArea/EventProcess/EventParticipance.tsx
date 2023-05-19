import { Avatar, Card, CardContent, CardHeader, Checkbox, Grid, IconButton, Paper, TextField, TextareaAutosize, Typography } from "@mui/material";
import React from "react";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

type EventEnrollmentProps = {
    roundCount: number;
    currentRoundDisplayIndex: number;
    partner: any;
    tableName: string;
}

export default function EventParticipance(props: EventEnrollmentProps) {

    // console.log(props.participation);

    return <Grid container direction={'column'} spacing={2} minHeight={'100vh'} textAlign={'center'} >
        <Grid item>
            <Paper elevation={0} style={{ padding: '1em' }}>
                <Typography variant='caption'>Round {props.currentRoundDisplayIndex} of {props.roundCount}</Typography>
            </Paper>
        </Grid>

        <Grid item>
            <Paper elevation={3} style={{ padding: '2em', backgroundColor: 'burlywood' }}>
                <Typography variant="h5">{props.tableName} </Typography>
                <Typography variant="caption">Your current table</Typography>
            </Paper>
        </Grid>

        <Grid item>

            <Card sx={{ width: '100%', textAlign: 'start' }} elevation={0}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'red[500]' }} aria-label="recipe">
                            {props.partner.name[0].toUpperCase()}
                        </Avatar>
                    }
                    action={
                        <>
                            <Checkbox
                                checkedIcon={<FavoriteIcon color="success" />}
                                icon={<FavoriteBorderIcon color="disabled" />}
                            />
                            
                        </>
                    }
                    title={props.partner.name}
                    subheader={props.partner.nickname}
                />




                <CardContent>
                    <Typography variant="body2" color="text.secondary">{props.partner.aboutMe}</Typography>
                </CardContent>
            </Card>
        </Grid>

        <Grid item container flexGrow={1} flexDirection={'column'} textAlign={'start'}>
            <Typography variant="caption" color={'gray'}>Notes for myself:</Typography>
            <TextareaAutosize minRows={5} style={{ height: 'auto', flexGrow: 1 }} />
        </Grid>

    </Grid>
}