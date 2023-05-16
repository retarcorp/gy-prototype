import { Box, Typography } from "@mui/material";
import OnboardingForm from "./OnboardingForm";
import withUserWrapper from "../withUserWrapper";
import { useDispatch, useSelector } from "react-redux";
import { submitOnboarding } from "../../../store/user";
import UserEventsPage from "../Events/UserEventsPage";
import { useEffect } from "react";


function OnboardingPage() {

    const dispatch = useDispatch();
    const onSubmit = (data) => {
        dispatch(submitOnboarding(data));
    }

    const onboardingCompleted = useSelector(state => state.user?.user?.onboardingCompleted);
    console.log(onboardingCompleted);
    useEffect(() => {
        if (onboardingCompleted) {
            window.location.href = '/';
        }
    }, [onboardingCompleted])

    return <Box>
        <Typography variant="h4" textAlign={'center'} marginBottom={2}>Almost done! Just a few things to go.</Typography>
        <OnboardingForm onSubmit={onSubmit} />
    </Box>
}

export default withUserWrapper(OnboardingPage);