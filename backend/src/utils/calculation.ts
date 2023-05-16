import { writeFileSync } from "fs";

type Participant = number;

export type TableRound = {
    tableId: number;
    participants: Participant[]
}

export type CalculatedRound = {
    index: number;
    tableParticipants: TableRound[]
}


export function validateRounds(Tn, Rn, N, rounds) {
    if (rounds.length !== Rn) {
        throw new Error('Round count is not equal ' + Rn);
    }
    if (rounds.some(r => r.length !== Tn)) {
        throw new Error('Some rounds have incorrect amount of tables!')
    }
    const flattened = rounds.flat(1).map(String);
    if (flattened.length !== [...new Set(flattened)].length) {
        throw new Error('Duplicated couple entries found around the game!')
    }
    const indicesSum = rounds.flat(2).reduce((a, b) => a + b, 0);
    const gameHashSum = new Array(N).fill(0).map((_, i) => i).reduce((a, b) => a + b, 0) * Rn;
    if (indicesSum !== gameHashSum) {
        throw new Error('Hashsum of game is incorrect! ' + indicesSum + ' got, must be ' + gameHashSum);
    }

    return true;
}

export default function calculatePositions(participants: number[], tables: number[]): CalculatedRound[] {

    const tableCount: number = tables.length;
    const operatingParticipants = [...participants];

    if (operatingParticipants.length % 2 === 1) {
        operatingParticipants.push(null)
    }

    const roundCount: number = operatingParticipants.length - 1;
    const Tn = tableCount;
    const Rn = roundCount;
    const N = operatingParticipants.length;

    const indices: number[] = operatingParticipants.map((_, i) => i);

    const topTable = indices.slice(0, indices.length / 2);
    const bottomTable = indices.slice(indices.length / 2);

    const rounds = new Array(indices.length - 1).fill(0).map((_, i) => {
        const result = topTable.map((t, i) => [t, bottomTable[i]]);
        bottomTable.push(topTable.pop() as number);
        topTable.splice(1, 0, bottomTable.shift() as number);
        return result;
    })
    
    validateRounds(Tn, Rn, N, rounds);
    
    const resultRounds: CalculatedRound[] = rounds.map((r: number[][], i) => ({
        index: i,
        tableParticipants: r.map((tableCouple, i): TableRound => ({
            tableId: tables[i],
            participants: tableCouple.map(i => operatingParticipants[i])
        }))
    }))
    
    return resultRounds;
}