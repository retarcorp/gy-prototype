import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

type EventEnrollmentProps = {
    event: Event;
    [key: string]: any;
}



export default function EventEnrollment(props: EventEnrollmentProps) {

    console.log(props);

    const [code, setCode] = useState('');
    useEffect(() => {
        setCode(props.enrollmentPIN);
    }, [])

    const grCodeValue = () => {
        return 'https://localhost:3000/event/' + code + '/enroll';
    }

    return (
        <Grid container direction={'column'} spacing={2} justifyContent={'center'} alignItems={'center'} minHeight={'100vh'} textAlign={'center'} >

            <Grid item>
                <Typography variant="caption" color={'gray'}>Show this QR code to event administrator to start the event:</Typography>

            </Grid>

            <Grid item>
                <QRCode value={grCodeValue()} />
            </Grid>

            <Grid item>
                <Typography variant="caption" color={'gray'}>or</Typography>

            </Grid>

            <Grid item>
                <Typography variant={'h2'} color={'orangered'}>{code.split('').map(s => <span style={{ margin: '0 .3em' }}>{s}</span>)}</Typography>
                <Typography variant="caption" color={'gray'}>Display this code to the administrator and he'll add you to participants pool.</Typography>
            </Grid>

            <Grid item justifySelf={'flex-end'}>

                <Button variant={'text'} color={'secondary'} href="/user/events/">Back to event list</Button>
            </Grid>
        </Grid>
    );
}