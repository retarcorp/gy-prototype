import { Button } from "@mui/material"
import { useState } from "react"
import ParticipantCard from "./ParticipantCard"
import data from "../../testData/participants"

export default function SetParticipantListForm({ onStartGame }) {


    const [participants, setParticipants] = useState(data)
    const getParticipant = () => ({
        id: (new Date() * (1 + Math.random())).toString(32),
        name: '',
        nickname: '',
    })

    const addParticipant = () => {
        setParticipants(participants.concat(getParticipant()))
    }
    const removeParticipant = (id) => setParticipants(participants.filter((i) => i.id !== id))

    const updateName = (id, value) => {
        const item = participants.find((i) => i.id === id);
        const updated = { ...item, name: value };
        participants.splice(participants.indexOf(item), 1, updated)
        setParticipants([...participants])
    }
    const updateNickname = (id, value) => {
        const item = participants.find((i) => i.id === id);
        const updated = { ...item, nickname: value };
        participants.splice(participants.indexOf(item), 1, updated)
        setParticipants([...participants]);
    }

    return <>

        {participants.map((item, index) => <ParticipantCard 
            key={item.id} 
            {...item} 
            index={index} 
            updateName={(...args) => updateName(...args)} 
            updateNickname={(...args) => updateNickname(...args)} 
            onRemove={(id) => removeParticipant(id)} 
        />)}

        <Button title="Add Participant" onClick={() => addParticipant()} style={{marginRight: 10}}> Add Participant</Button>
        <Button variant="contained" color="success" onClick={() => onStartGame(participants)}>Start game</Button>
    </>
}