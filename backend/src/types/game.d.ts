import { Game, Round, Table, TableArrangement, User } from "@prisma/client";

export type GameSetup = Game & {
    participants: Participant & { user: User }[];
    tables: Table[];
    rounds: Round[];
    tableArrangements: TableArrangement[];
}

export type RoundSetup = Round & {
    tables: Table[];
    tableArrangements: TableArrangement[];
}