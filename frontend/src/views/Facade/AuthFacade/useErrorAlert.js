import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
let intervalId = 0;

export default function useErrorAlert() {
    const [errorMessage, setErrorMessage] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);

    const displayError = (error) => {
        setSnackOpen(true);
        setErrorMessage(error);
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            setSnackOpen(false)
        }, 3000)
    }

    const errorComponent = () => (<Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackOpen}
        onClose={() => setSnackOpen(false)
        }
    >
        <Alert severity="error" sx={{ width: '100%' }}>
            {errorMessage}
        </Alert>
    </Snackbar >)

    return [errorComponent, displayError];
}