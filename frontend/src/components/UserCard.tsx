import React from "react";
import { Avatar, Card, CardHeader } from "@mui/material";

type UserCardProps = {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}
export default function UserCard(props: UserCardProps) {
    return <Card sx={{ width: '100%', textAlign: 'start' }} elevation={1}>
    <CardHeader
        avatar={
            <Avatar sx={{ bgcolor: 'gray' }} aria-label="recipe">
                {props.title.charAt(0)}
            </Avatar>
        }
        title={props.title}
        subheader={props.subtitle}
        action={props.children}
    />
</Card>
}