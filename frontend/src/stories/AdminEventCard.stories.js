import { object } from "prop-types"
import AdminEventCard from "../components/AdminEventCard.tsx"

export default {
    title: 'Admin/Components/AdminEventCard',
    component: AdminEventCard,
    argTypes: {
        event: object
    }
}

export const Basic = {
    args: { 
        event: {
            id: 1,
            title: 'Speed Dating in Gay Club',
            dateTime: new Date(),
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl sed tincidunt aliquam.',
            location: 'Budapest XIII. kerület, Váci út 1-3.',
            price: 3500,
            participantLimit: 20,

            participantCount: 8,
            isDraft: false,
        }
    }
}

export const Draft = {
    args: { 
        event: {
            id: 1,
            title: 'Speed Dating in Straight Club',
            dateTime: new Date(),
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl sed tincidunt aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl sed tincidunt aliquam.',
            location: 'Budapest XIII. kerület, Váci út 1-3.',
            price: 10000,
            participantLimit: 20,

            participantCount: 8,
            isDraft: true,
        }
    }
}
