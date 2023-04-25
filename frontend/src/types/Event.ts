export type Event = {
    id: number;
    title: string;
    description: string;
    dateTime: string | Date;
    price: number;
    location: string;
    participantLimit: number;
    participantCount: number;
    isDraft: boolean;

}
