import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from "react-redux";
import { logOut } from "../../store/user";

export default function withUserWrapper(Component) {
    return function UserWrapper(props) {

        const dispatch = useDispatch();
        const onLogOut = () => {

            dispatch(logOut())
        }

        return <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Have fun with us!
                        </Typography>
                        <Button color="inherit" onClick={onLogOut}>Log Out</Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ width: '80%', margin: '0 auto', paddingTop: '10px' }}>
                    <Component {...props} />
                </Box>
            </Box>

        </>
    }
}