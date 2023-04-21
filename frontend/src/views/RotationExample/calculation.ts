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
    const pairs: Array<number[]> = indices.flatMap(i => new Array(N - i - 1).fill(0).map((_, delta) => [i, i + delta + 1]))

    let iterationCount = 0;
    const MAX_ITERATIONS = Tn * Rn * (N ** 2);
    
    const getRound = (availablePairs) => {
        const stack = new Array(0);
        stack.push(availablePairs[0]);
        // console.group('New round iteration!')
        while(stack.length < Tn) {

            // console.log('Iteration ' + iterationCount + ' of '+ MAX_ITERATIONS);
            if (iterationCount++ > MAX_ITERATIONS) {
                throw new Error('Max calculations iterations reached!')
            }
            // console.group('Iteration ' + stack.length + ' / ' + Tn)
            // console.log('Stack before: ' + stack.join(' | '))
            // console.log('Pairs available: ' + availablePairs.join(' | '))

            const indicesInStack = [...new Set(stack.flat())].sort((a, b) => a - b);
            // console.log('Indices in stack: ' + indicesInStack);
            const filteredPairs = availablePairs.filter((pair) => !indicesInStack.some(i => pair.includes(i)));
            // console.log('Pairs filtered: ' + filteredPairs.join(' | '));
            if(filteredPairs.length === 0) {
                // console.warn('Filtered pairs is empty! Cannot proceed! Going back.');
                stack.pop();
                stack.push(availablePairs[1]);
                availablePairs.splice(1, 1)
                // console.groupEnd()
                continue;
            }
            stack.push(filteredPairs[0]);
            // console.log('New pair selected: ' + filteredPairs[0])
            availablePairs = filteredPairs.slice(1);
            // console.groupEnd()
        }
        // console.log('Result round: ' + stack.join(' | '))
        // console.groupEnd();

        return stack;
    }

    const rounds: number[][][] = []; // Round -> Tables -> Participants
    let availablePairs: number[][] = pairs.sort(() => Math.random() - 0.5);
    while(rounds.length < Rn) {
        const newRound = getRound(availablePairs);
        availablePairs = availablePairs.filter(pair => !newRound.some(Np => (Np[0] === pair[0] && Np[1] === pair[1])))
        rounds.push(newRound);
    }

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