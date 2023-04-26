import { Box, Button, MobileStepper } from "@mui/material";
import { useState } from "react";
import SwipeableViews from 'react-swipeable-views';
import HowItWorksStep from "../../../components/HowItWorksStep.tsx";
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';


const steps = `Register on the app by creating a profile with your details.
View upcoming events and select one that you want to attend.
Enroll for the event by paying the registration fees through the app.
Receive confirmation of your enrollment on your phone.
Attend the event in person and meet new people in a structured setting.
Make notes on each person you meet and select those you are interested in.
Following the event, receive notification of any mutual matches from the app.
Access the contact details of any person you have matched with and continue the conversation at your leisure.
That's it! You are now ready to use the speed dating app and find potential love interests in a fun, quick and easy way.`.split('\n')


export default function HowItWorks(props) {

    const [currentStep, setCurrentStep] = useState(0)
    const onFinish = () => props.onFinish();

    return <>
        <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}>

            <SwipeableViews
                index={currentStep}
                onChangeIndex={v => setCurrentStep(v)}
                enableMouseEvents
            >
                {steps.map((step, index) => <HowItWorksStep title={step} index={index}>
                    {index === steps.length - 1 ? <Button variant="contained" onClick={onFinish}>Continue</Button> : null}
                </HowItWorksStep>)}

            </SwipeableViews>

            <MobileStepper
                steps={steps.length}
                activeStep={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}

                nextButton={
                    <Button
                        size="small"
                        onClick={onFinish}
                        sx={{ justifySelf: 'flex-end' }}
                    >
                        Skip
                        <KeyboardArrowRight />
                    </Button>
                }
            >

            </MobileStepper>
        </Box >
    </>
}