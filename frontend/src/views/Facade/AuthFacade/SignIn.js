import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import SocialButtons from "./SocialButtons";

export default function SignIn(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const proceed = () => {
        props.onSignIn({email, password})
    }

    return <Grid container textAlign={'center'} justifyContent={'center'} alignItems={'center'}>
        <Grid container spacing={2} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} minHeight={'100vh'} boxSizing={'border-box'} padding={10} maxWidth={'600px'}>
            <Grid item xs={12} marginBottom={5}>
                <Typography variant="h3" textAlign='center'>Sign In</Typography>
            </Grid>

            <Grid container item xs={12} spacing={2}>
                <Grid item xs={12}>
                    <TextField type="email" label="E-mail" fullWidth value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField type="password" label="Password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
                </Grid>
                <Grid item container spacing={2} justifyContent={'center'}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={proceed}>Sign In</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="text" color="primary" onClick={props.onSignUp}>Sign Up</Button>
                    </Grid>
                </Grid>
            </Grid>

            <SocialButtons {...props} />
        </Grid>
    </Grid>
}