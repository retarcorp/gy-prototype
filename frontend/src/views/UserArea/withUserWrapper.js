import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import useLogOut from "../../hooks/useLogOut";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "../../store/user";
import { useEffect, useState } from "react";

export default function withUserWrapper(Component) {
    return function UserWrapper(props) {

        const [internalMode, setInternalMode] = useState('idle');
        const doLogOut = useLogOut();
        const logOut = () => {
            doLogOut();
            window.location.href = '/';
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
                        <Button color="inherit" onClick={logOut}>Log Out</Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ width: '80%', margin: '0 auto', paddingTop: '10px' }}>
                    <Component {...props} />
                </Box>
            </Box>

        </>

    }
}