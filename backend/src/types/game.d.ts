import { Game, GameLike, Round, Table, TableArrangement, User, UserNotes } from "@prisma/client";

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

export type PublicProfile = {
    id: number;
    name: string;
    nickname: string;
    aboutMe: string;
}

export type PreliminaryResults = {
    participatedUsers: PublicProfile[];
    likes: GameLike[];
    notes: UserNotes[];
}