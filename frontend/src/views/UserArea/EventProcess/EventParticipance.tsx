import { Avatar, Card, CardContent, CardHeader, Checkbox, Grid, IconButton, Paper, TextField, TextareaAutosize, Typography } from "@mui/material";
import React from "react";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

type EventEnrollmentProps = {
}

export default function EventParticipance(props: EventEnrollmentProps) {


    return <Grid container direction={'column'} spacing={2} minHeight={'100vh'} textAlign={'center'} >
        <Grid item>
            <Paper elevation={0} style={{ padding: '1em' }}>
                <Typography variant='caption'>Round 5 of 15</Typography>
            </Paper>
        </Grid>

        <Grid item>
            <Paper elevation={3} style={{ padding: '2em', backgroundColor: 'burlywood' }}>
                <Typography variant="h5">Red Onion </Typography>
                <Typography variant="caption">Your current table</Typography>
            </Paper>
        </Grid>

        <Grid item>

            <Card sx={{ width: '100%', textAlign: 'start' }} elevation={0}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'red[500]' }} aria-label="recipe">
                            R
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
                    title="Alex"
                    subheader="I feel good"
                />




                <CardContent>
                    <Typography variant="body2" color="text.secondary">I'm a fun-loving, adventurous and open-minded guy who enjoys trying new things. I'm passionate about cooking, music, and travel. A good listener, empathetic and always up for a good laugh. Ambitious and hardworking, I believe in pursuing my dreams while staying grounded in reality. I value honesty, integrity, and kindness, and strive to treat others the way I want to be treated.     </Typography>
                </CardContent>
            </Card>
        </Grid>

        <Grid item container flexGrow={1} flexDirection={'column'} textAlign={'start'}>
            <Typography variant="caption" color={'gray'}>Notes for myself:</Typography>
            <TextareaAutosize minRows={5} style={{ height: 'auto', flexGrow: 1 }} />
        </Grid>

    </Grid>
}