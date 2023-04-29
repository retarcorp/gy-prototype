import AdminEventDashboardPage from "../views/AdminArea/EventDashboard/AdminEventDashboardPage";
import { Event } from "../types/Event"
import events from '../testData/events';

export default {
    title: 'Admin/Pages/EventDashboard',
    component: AdminEventDashboardPage,
    argTypes: {
        event: Object
    }
}
const event: () => Event = () => events.sort(() => Math.random() - 0.5)[0];

export const UpcomingEvent = {
    args: {
        event: {
            ...event(),
            status: 'upcoming'
        }
    }
}

export const OpenedEvent = {
    args: {
        event: {
            ...event(),
            status: 'opened'
        }
    }
}

export const RunningEvent = {
    args: {
        event: {
            ...event(),
            status: 'running'
        }
    }
}

export const FinalEvent = {
    args: {
        event: {
            ...event(),
            status: 'final'
        }
    }
}

export const ClosedEvent = {
    args: {
        event: {
            ...event(),
            status: 'closed'
        }
    }
}