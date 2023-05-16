import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import useLogOut from "../../hooks/useLogOut";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { validateToken } from "../../store/user";

export default function withAdminWrapper(Component) {
    return function AdminWrapper(props) {

        const onLogOut = useLogOut();

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
                            Administrate app's events and data
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

export function withAdminAuthWrapper(Component) {
    return function AdminAuthWrapper(props) {
        const token = useSelector(state => state.user.token);
        const currentUser = useSelector(state => state.user.user);
        const isLoading = useSelector(state => state.user.isLoading);
        const isTokenChecked = useSelector(state => state.user.isTokenChecked);

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(validateToken());
        }, [dispatch])

        if (isTokenChecked) {
            if (!currentUser) {
                window.location.href = '/';
                return <></>
            }
            if(!currentUser.isAdmin) {
                window.location.href = '/';
                return <></>
            }
        }

        return <>
            <Component {...props} />
        </>
    }
}