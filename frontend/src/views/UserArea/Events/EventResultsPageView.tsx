import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';
import EventCard from '../../../components/EventCard';
import { formatEvent } from '../../../hooks/useFetchAdminEvents';

type EventResultsPageProps = {
    event: any,
    results: any[];
}

export default function EventResultsPageView(props: EventResultsPageProps) {

    const currentEvent = formatEvent(props.event);
    const matches = props.results.filter((r: any) => r.type === 'MATCH');
    const likes = props.results.filter((r: any) => r.type === 'LIKEDBY');

    const [currentTab, setCurrentTab] = React.useState<number>(0);

    return <Box>
        <Grid container direction={'column'} spacing={2} minHeight={'100vh'} >
            <Grid item>
                {currentEvent && <EventCard event={currentEvent}>
                    <Button href='/user/events/' variant='text'>Back to events</Button>
                </EventCard>}
            </Grid>

            <Grid item>
                <Typography textAlign='center' variant="h4">Event results:</Typography>
            </Grid>

            <Grid item>
                <Tabs value={currentTab} onChange={(e, i) => setCurrentTab(i)}>
                    <Tab label={`Matches (${matches.length})` } value={0}></Tab>
                    <Tab label={`Liked by others (+${likes.length})`} value={1}></Tab>
                </Tabs>
            </Grid>

            <Grid item>
                <Grid container direction={'column'} spacing={1}>
                    {(currentTab === 0 ? matches : likes).map(({targetUser: p}) => <Grid item>
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
                                <Typography variant="body2" color="text.secondary">{p.notes}</Typography>
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