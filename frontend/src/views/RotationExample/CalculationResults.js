import { Box, Button, Card, CardContent, Grid, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Fragment, useState } from "react"

export default function CalculationResults({ results, onBack }) {

    const [currentRound, setCurrentRound] = useState(0);

    const RoundTable = (tableData) => {
        return <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} alignItems={'center'}>
                        <Grid xs={3} item>
                            {tableData.participants[0].name} <i>aka {tableData.participants[0].nickname}</i>
                        </Grid>
                        <Grid xs={6} item>
                            <Box style={{backgroundColor: 'sienna', minHeight: '150px', color: '#cccccc', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {results.tables.find((t) => t.id === tableData.tableId).name}
                            </Box>
                        </Grid>
                        <Grid xs={3} item>
                            {tableData.participants[1].name} <i>aka {tableData.participants[1].nickname}</i>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    }

    return <>
        <Box>
            <Box marginBottom={5}>
                <Button onClick={onBack}>Back to participant list</Button>
            </Box>

            <Grid container spacing={4} marginBottom={4}>
            {results.rounds[currentRound].tableParticipants.map(tables => <>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={tables.index}>
                    {RoundTable(tables)}
                </Grid>
            </>)}
            </Grid>
            
            <Pagination count={results.rounds.length} page={currentRound + 1} onChange={(e, v) => setCurrentRound(v - 1)}/>

            <Box marginTop={10} marginBottom={10}>
                <TableContainer component={Paper}>
                    <Table sx={{}} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Player 1</TableCell>
                                <TableCell>Table Name</TableCell>
                                <TableCell>Player 2</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {results.rounds.map((round, index) => <Fragment key={index}>
                                <TableRow>
                                    <TableCell colSpan={3}><b>Round #{index + 1}</b></TableCell>
                                </TableRow>
                                {round.tableParticipants.map((table, idx) => <TableRow key={idx}>
                                    <TableCell>{table.participants[0].name}</TableCell>
                                    <TableCell>{results.tables[table.tableId].name}</TableCell>
                                    <TableCell>{table.participants[1].name}</TableCell>
                                </TableRow> )}
                            </Fragment>)}

                        </TableBody>

                    </Table>
                </TableContainer>
            </Box>
        </Box>
    </>
}