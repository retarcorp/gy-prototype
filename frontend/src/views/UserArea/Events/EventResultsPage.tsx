import { Avatar, Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import EventCard from '../../../components/EventCard';
import testEvents, { testPastEvents } from '../../../testData/events';
import participants from '../../../testData/participants.js'

type EventResultsPageProps = {}

const getSelection = (N: number) => participants.sort(() => Math.random() - 0.5).slice(0, N).map((p: any) => {
    return {
        id: p.id,
        name: p.name,
        nickname: p.nickname,
        isLiked: Math.random() > 0.5,
        aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec odio et massa finibus laoreet. Integer ut aliquam lacus, ',
        note: 'dolor sit amet, consectetur adipiscing elit. Sed nec odio et massa finibus laoreet. Integer ut aliquam lacus, ',
        contacts: 'Phone: +36'+Math.floor(Math.random()*1000000000) + ', email: '+p.nickname.toLowerCase().replace(' ', '.')+'@gmail.com'
    }
})

export default function EventResultsPage(props: EventResultsPageProps) {

    const [currentEvent, setCurrentEvent] = React.useState<any>(null);
    const [matches, setMatches] = React.useState<any[]>([]);
    const [likes, setLikes] = React.useState<any[]>([]);
    const [currentTab, setCurrentTab] = React.useState<number>(0);

    useEffect(() => {
        setCurrentEvent(testPastEvents[0]);


        setMatches(getSelection(4));
        setLikes(getSelection(12));
    }, [currentTab]);


    return <Box>
        <Grid container direction={'column'} spacing={2} minHeight={'100vh'} >
            <Grid item>
                {currentEvent && <EventCard event={currentEvent}>
                    <Button href='/events/' variant='text'>Back to events</Button>
                </EventCard>}
            </Grid>

            <Grid item>
                <Typography textAlign='center' variant="h4">Event results:</Typography>
            </Grid>

            <Grid item>
                <Tabs value={currentTab} onChange={(e, i) => setCurrentTab(i)}>
                    <Tab label='Matches (4)' value={0}></Tab>
                    <Tab label='Liked by others (+12)' value={1}></Tab>
                </Tabs>
            </Grid>

            <Grid item>
                <Grid container direction={'column'} spacing={1}>
                    {(currentTab === 0 ? matches : likes).map(p => <Grid item>
                        <Card sx={{ width: '100%', textAlign: 'start' }} elevation={1}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: 'red[500]' }} aria-label="recipe">
                                        {p.name.charAt(0)}
                                    </Avatar>
                                }
                                title={p.name}
                                subheader={p.nickname}
                            />

                            <CardContent>
                                <Typography variant="caption" color={'gray'}>About {p.name}: </Typography>
                                <Typography variant="body2" color="text.secondary" >{p.aboutMe}</Typography>
                                <Divider style={{margin: '10px 0'}}/>
                                <Typography variant="caption" color={'gray'}>My notes about {p.name}: </Typography>
                                <Typography variant="body2" color="text.secondary">{p.note}</Typography>
                                <Divider style={{margin: '10px 0'}}/>
                                <Typography variant="caption" color={'gray'}>Contacts that {p.name} shared: </Typography>
                                <Typography variant="body2" color="text.secondary">{p.contacts}</Typography>
                                {/* <TextField value={p.note} rows={4} fullWidth multiline label={'Notes for myself'} onChange={(e) => updateEntry(i, 'note', e.target.value)} /> */}
                            </CardContent>
                        </Card>
                    </Grid>)}
                </Grid>
            </Grid>
        </Grid>
    </Box>
}