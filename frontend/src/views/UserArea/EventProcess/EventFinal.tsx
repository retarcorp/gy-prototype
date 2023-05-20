import React, { Fragment, useEffect, useState } from "react";
import { Avatar, Button, Card, CardContent, CardHeader, Checkbox, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import participants from '../../../testData/participants.js'

type EventFinalProps = {
    likes: any[];
    notes: any[];
    partners: any[];
    onSave: (entries: any[]) => void;
}

export default function EventFinal(props: EventFinalProps) {

    const [data, setData] = useState<any>([])
    const [expanded, setExpanded] = useState<boolean[]>([]);


    useEffect(() => {
        setData(props.partners.map((p: any) => {
            return {
                id: p.id,
                name: p.name,
                nickname: p.nickname,
                isLiked: props.likes.some((l) =>  l.targetUserId === p.id), 
                aboutMe: p.aboutMe,
                note: (n => n ? n.notes : '')(props.notes.find((n) => n.targetUserId === p.id)) 
            }
        }))
        setExpanded(participants.map(() => false));
    }, [props.partners])

    const toggle = (index: number) => {
        setExpanded(expanded.map((e, i) => i === index ? !e : e))
    }
    const updateEntry = (index: number, field: string, value: any) => {
        setData(data.map((e: any, i: number) => i === index ? { ...e, [field]: value } : e))
    }

    const saveEntries = () => {
        return props.onSave(data.map(({id, isLiked, note}: any) => ({id, like: isLiked, note})))
    }

    return <Grid container direction={'column'} spacing={2} minHeight={'100vh'} textAlign={'center'} >

        <Grid item>
            <Typography variant="h4">Event is finished!</Typography>
            <Typography variant="body1">Review your date results carefully and make all changes before administrator closes the event. After that point all contacts will be shared with matches and likes.</Typography>
        </Grid>

        <Grid item container spacing={1} direction={'column'} >
            {data.map((p: any, i: number) => (<Fragment key={p.id}>
                <Grid item >
                    <Card sx={{ width: '100%', textAlign: 'start' }} elevation={1}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: 'red[500]' }} aria-label="recipe">
                                    {p.name.charAt(0)}
                                </Avatar>
                            }
                            action={
                                <>
                                    <Checkbox
                                        onChange={(e) => updateEntry(i, 'isLiked', e.target.checked)}
                                        checked={p.isLiked}
                                        checkedIcon={<FavoriteIcon color="success" />}
                                        icon={<FavoriteBorderIcon color="disabled" />}
                                    />
                                    <IconButton aria-label="dropdown" onClick={() => toggle(i)}>
                                        {expanded[i] ? <ExpandLessIcon /> : <ExpandMoreIcon />}

                                    </IconButton>
                                </>
                            }
                            title={p.name}
                            subheader={p.nickname}
                        />

                        {expanded[i] && <CardContent>
                            <Typography variant="caption" color={'gray'}>About {p.name}: </Typography>
                            <Typography variant="body2" color="text.secondary" marginBottom={2}>{p.aboutMe}</Typography>
                            <TextField value={p.note} rows={4} fullWidth multiline label={'Notes for myself'} onChange={(e) => updateEntry(i, 'note', e.target.value)} />
                        </CardContent>}
                    </Card>
                </Grid >
            </Fragment>))}
        </Grid>

        <Grid item container justifyContent={'center'} spacing={2} marginTop={1}>
            <Button variant="contained" color="primary" size="large" onClick={saveEntries}>Save</Button>
            <Button variant="text" color="secondary" size="large" href="/user/events/">Back to event list</Button>
        </Grid>
    </Grid>
}