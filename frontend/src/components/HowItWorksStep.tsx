import { Avatar, Box, Typography } from '@mui/material';
import React, { ElementType } from 'react';
interface HowItWorksStepProps {
    index: number;
    title: string;
    children: ElementType<any> | any;
}
const colors = ['#c0392b', '#e67e22', '#f1c40f', '#27ae60', '#2980b9', '#8e44ad'];
export default function HowItWorksStep(props: HowItWorksStepProps) {

    const color = colors[props.index % colors.length];

    return <>
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100vh', boxSizing: 'border-box', padding: '20px' }}>
            <Avatar sx={{ bgcolor: color, width: '60px', height: '60px', fontSize: '2.2em' }}>{props.index + 1}</Avatar>
            <Typography variant='h5' color={color} margin={2} sx={{ cursor: 'grab' }}>{props.title}</Typography>
            {props.children}
        </Box>
    </>
}