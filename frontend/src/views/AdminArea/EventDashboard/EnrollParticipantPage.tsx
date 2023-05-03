import React from "react";
import participants from '../../../testData/participants'
import { Box, Button, Grid, Typography } from "@mui/material";
import UserCard from "../../../components/UserCard";

export default function EnrollParticipantPage() {


    const [participant, setParticipant] = React.useState<any>(participants.sort(() => Math.random() - 0.5)[0]);
    const [currentStage, setCurrentStage] = React.useState<'question' | 'accepted'>('question');
    const [isQR, setIsQR] = React.useState<boolean>(Math.random() > 0.5);

    const QuestionBlock = () => <Grid container spacing={4} direction={'column'} margin={'0 auto'} maxWidth={'600px'}>
        <Grid item xs={12}>
            <Typography variant="h4" textAlign={'center'}>Add {participant.name} to game?</Typography>
        </Grid>
        <Grid item xs={12}>
            <UserCard title={participant.name} subtitle={participant.nickname} />
        </Grid>
        <Grid item xs={12}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button variant="contained" color="success" fullWidth onClick={() => setCurrentStage('accepted')}>Add</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" color="error" fullWidth>Discard</Button>
                </Grid>
            </Grid>
        </Grid>
    </Grid>;

    const backButton = <Button variant="text" color="primary" fullWidth>Back to list</Button>;
    const closeTabButton = <Button variant="text" color="primary" fullWidth>Close tab</Button>;

    const AcceptedBlock = () => <Grid container spacing={4} direction={'column'} margin={'0 auto'} maxWidth={'600px'}>
        <Grid item xs={12}>
            <Typography variant="h4" textAlign={'center'}>{participant.name} added</Typography>
        </Grid>
        <Grid item xs={12}>
            {isQR ? backButton : closeTabButton}
        </Grid>
    </Grid>;

    return <Box>
        { currentStage === 'question' ? <QuestionBlock /> : <AcceptedBlock />}
    </Box>;
}