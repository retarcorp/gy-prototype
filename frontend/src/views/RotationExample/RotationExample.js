import { Container, Typography } from '@mui/material'
import SetParticipantListForm from './SetParticipantListForm';
import { useState } from 'react';
import CalculationResults from './CalculationResults';
import calculatePositions from './calculation.ts';

const RotationExample = () => {

    const [stage, setStage] = useState('setList')
    const [calculationResults, setCalculationResults] = useState(null);

    const onStartGame = (participantsList) => {
        setStage('calculation')
        setTimeout(() => {

            let attemptCount = 0;
            const attempt = () => {
                try {
                    setCalculationResults(calculatePositions(participantsList));
                    setStage('calculationResults')
                    console.log('Calculated from attempt #' + attemptCount)
                } catch (e) {
                    attemptCount++;
                    if (attemptCount < 1000) {
                        // console.warn('Attempt #' + attemptCount);
                        return attempt()
                    }
                    setStage('setList')
                    throw new Error('Unable to calculate! Attempt count exceeded. ');
                }
            }     
            attempt()       
        }, 1);
    }

    return <>

        <Container>
            <h2>Rotation Example</h2>
            {stage === 'setList' ? <SetParticipantListForm onStartGame={(items) => onStartGame(items)} /> : null}
            {stage === 'calculation' ? <Typography variant='caption'> Calculation... </Typography> : null}
            {stage === 'calculationResults' ? <CalculationResults results={calculationResults} onBack={() => setStage('setList')} /> : null}

        </Container>
    </>
}

export default RotationExample;
