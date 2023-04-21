import { validateRounds } from "./calculation.ts";
import colors from "./colors";

type Table = {
    id: string;
    name: string;
}

type Participant = {
    id: string;
    name: string;
    nickname: string;
}

type TableRound = {
    tableId: string;
    participants: Participant[]
}

type Round = {
    index: number;
    tableParticipants: TableRound[]
}

interface CalculationResults {
    tables: Table[];
    participants: Participant[];
    rounds: Round[];
}

export default function calculatePositions(participants): CalculationResults {

    const result: CalculationResults = {
        tables: [],
        participants: participants,
        rounds: []
    }

    const tableCount: number = Math.ceil(participants.length / 2);
    

    result.tables = new Array(tableCount).fill(0).map((_, i) => ({
        id: String(i),
        name: colors[i]
    }))

    if (participants.length % 2 === 1) {
        result.participants.push({
            id: 'empty',
            name: 'Empty',
            nickname: 'Empty'
        })
    }

    const roundCount: number = participants.length - 1;
    const Tn = tableCount;
    const Rn = roundCount;
    const N = participants.length;

    const indices: number[] = participants.map((_, i) => i);

    const topTable = indices.slice(0, indices.length / 2);
    const bottomTable = indices.slice(indices.length / 2);

    console.log(topTable, bottomTable);

    const rounds = new Array(indices.length - 1).fill(0).map((_, i) => {
        const result = topTable.map((t, i) => [t, bottomTable[i]]);
        bottomTable.push(topTable.pop() as number);
        topTable.splice(1, 0, bottomTable.shift() as number);
        return result;
    })
    
    validateRounds(Tn, Rn, N, rounds);
    
    const resultRounds: Round[] = rounds.map((r: number[][], i) => ({
        index: i,
        tableParticipants: r.map((tableCouple, i): TableRound => ({
            tableId: result.tables[i].id,
            participants: tableCouple.map(i => result.participants[i])
        }))
    }))
    
    result.rounds = resultRounds;


    return result;
}