import { Button, Card, Grid, TextField, Typography } from "@mui/material";

const ParticipantCard = (props) => {
    return <Card style={{marginBottom: '10px', padding: '5px'}}>
        <Grid container spacing={2} alignItems={'center'}>
            <Grid item xs={1}>
                <Typography variant="caption">{props.index + 1}</Typography>
            </Grid>
            <Grid item xs={5}>
                <TextField label='Name' fullWidth value={props.name} onChange={(e) => props.updateName(props.id, e.target.value)}></TextField>
            </Grid>
            <Grid item xs={4}>
                <TextField label='Nickname' fullWidth value={props.nickname} onChange={(e) => props.updateNickname(props.id, e.target.value)}></TextField>
            </Grid>
            <Grid item xs={2}>
                <Button variant="contained" onClick={() => props.onRemove(props.id)}>X</Button>
            </Grid>
        </Grid>
        
    </Card>
}

export default ParticipantCard;