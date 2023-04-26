import { Box, Typography } from "@mui/material";
import OnboardingForm from "./OnboardingForm";


export default function OnboardingPage() {

    return <Box>
        <Typography variant="h4" textAlign={'center'} marginBottom={2}>Almost done! Just a few things to go.</Typography>
        <OnboardingForm />
    </Box>
}