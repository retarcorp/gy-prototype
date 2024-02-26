import { Divider, Grid, IconButton, Typography } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';

export default function SocialButtons(props) {
    return <>
        <Grid item xs={12} marginTop={1} width={'80%'}>
            <Divider />
        </Grid>

        <Grid item container xs={12} marginTop={1}>
            <Grid item xs={12}>
                <Typography variant="caption" textAlign='center'>Or enter via</Typography>
            </Grid>
            <Grid container item spacing={2} justifyContent={'center'} alignItems={'center'}>
                <Grid item style={{ opacity: .4}}>
                    <IconButton disabled size="large" onClick={props.onFacebookSignIn}>
                        <FacebookIcon fontSize="large" color="primary" />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption" textAlign='center'>v1.0.1</Typography>
            </Grid>
        </Grid></>
}