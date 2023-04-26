import { Box, Button, Grid, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { useState } from "react";

export default function OnboardingForm(props) {

    const [phone, setPhone] = useState('')
    const [aboutMe, setAboutMe] = useState('')
    const [contactsForMatches, setContactsForMatches] = useState('')
    const [contactsForLikers, setContactsForLikers] = useState('')
    const [error, setError] = useState('')

    const h = (v, sV) => ({ value: v, onChange: (e) => {setError(null); sV(e.target.value) } });
    const onSubmit = () => {
        if (!phone) {
            setError('Please enter your mobile phone number! We cannot register you on an event without phone number.')
            return
        }
        if (!contactsForMatches) { 
            setError('Please enter your contacts for matches! Your potential matches won\'t be able to contact you without this information.')
            return
        }
        props.onSubmit({phone, aboutMe, contactsForMatches, contactsForLikers});
    }


    return <>
        {/* Mobile phone, contacts for matches, contacts for likers*/}
        <Grid container spacing={2} justifyContent="center" alignItems="start">
            <Grid item xs={12} md={6} lg={4}>
                <TextField label="Mobile Phone" variant="outlined" fullWidth {...h(phone, setPhone)}/>
                <Typography variant="caption" textAlign={'center'}>Required for confirmation of your personality and contacting you. Visible only to event administrator.</Typography>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <TextField label="About me" variant="outlined" fullWidth multiline rows={4} {...h(aboutMe, setAboutMe)} />
                <Typography variant="caption" textAlign={'center'}>Write a few words about yourself so your date partners will remember about who you are and may learn more about you. This information will be visible to all people you're gonna meet during the event.</Typography>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <TextField label="Contacts for matches" variant="outlined" fullWidth multiline rows={4} {...h(contactsForMatches, setContactsForMatches)}/>
                <Typography variant="caption" textAlign={'center'}>Please leave your contacts (phone number, email, etc.) in the text field below, for those you have found each other attractive. This will help them get in touch with you and potentially lead to a new connection or relationship. Remember to be safe and only share your contact information with people you feel comfortable with.</Typography>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <TextField label="Contacts for likers" variant="outlined" fullWidth multiline rows={4} {...h(contactsForLikers, setContactsForLikers)} />
                <Typography variant="caption" textAlign={'center'}>Please leave your contacts (phone number, email, etc.) in the text field below, for those who have liked you. </Typography>
            </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="center" alignItems="start" marginTop={1}>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" size="large" fullWidth onClick={onSubmit}>Continue to the app</Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption" textAlign={'center'} color="error">{error}</Typography>
            </Grid>
        </Grid>
    </>
}