import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';

export default function withUserWrapper(Component) {
    return function UserWrapper(props) {


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
                        <Button color="inherit">Log Out</Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ width: '80%', margin: '0 auto', paddingTop: '10px' }}>
                    <Component {...props} />
                </Box>
            </Box>

        </>
    }
}