import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event, EventStatus, Participant, PrismaClient, Registration } from '@prisma/client';

@Injectable()
export class EventsService {

    constructor(
        private readonly prismaClient: PrismaClient,
    ) { }

    async getEvents(status?: EventStatus[]): Promise<Event[]> {
        const where = status ? { status: { in: status } } : {};
        return await this.prismaClient.event.findMany({ where });
    }

    async createEvent(eventData: Event): Promise<Event> {
        return await this.prismaClient.event.create({
            data: {
                title: eventData.title,
                description: eventData.description,
                location: eventData.location,
                price: eventData.price,
                participantLimit: eventData.participantLimit,
                datetime: eventData.datetime,
                status: eventData.status,
            }
        });
    }

    async updateEvent(eventId: number, eventData: Partial<Event>): Promise<Event> {

        const event = await this.prismaClient.event.findUnique({
            where: {
                id: eventId,
            }
        });

        const allowedFields = ['title', 'description', 'location', 'price', 'participantLimit', 'datetime', 'status'];

        const eventEdit: Partial<Event> =
            allowedFields.reduce((prev: Partial<Event>, key: string) => key in eventData ? { [key]: eventData[key], ...prev } : prev, {});


        if (!([EventStatus.DRAFT, EventStatus.UPCOMING] as EventStatus[]).includes(event.status)) {
            throw new HttpException('Cannot update event that is not in draft or upcoming status', HttpStatus.FORBIDDEN);
        }

        return await this.prismaClient.event.update({
            where: {
                id: eventId,
            },
            data: eventEdit
        })
    }

    async deleteEvent(eventId: number): Promise<Event> {
        const event = await this.prismaClient.event.findUnique({
            where: {
                id: eventId,
            }
        });

        if (!event) {
            throw new HttpException('Event not found!', HttpStatus.NOT_FOUND);
        }

        return await this.prismaClient.event.delete({
            where: {
                id: eventId,
            }
        })
    }

    async registerOnEvent(userId: number, eventId: number): Promise<Registration> {
        const event = await this.prismaClient.event.findUnique({
            where: {
                id: eventId,
            }
        });

        if (!event) {
            throw new HttpException('Event not found!', HttpStatus.NOT_FOUND);
        }

        if (event.status !== EventStatus.UPCOMING) {
            throw new HttpException('Cannot register on event that is not in upcoming status', HttpStatus.FORBIDDEN);
        }

        const registrations = await this.prismaClient.registration.findMany({
            where: {
                eventId: eventId,
            }
        });

        if (registrations.some(registration => registration.userId === userId)) {
            throw new HttpException('User already registered on this event!', HttpStatus.FORBIDDEN);
        }

        if (registrations.length >= event.participantLimit) {
            throw new HttpException('Event is full!', HttpStatus.FORBIDDEN);
        }

        return await this.prismaClient.registration.create({
            data: {
                userId: userId,
                eventId: eventId,
                enrollmentPIN: Math.floor(1000 + Math.random() * 9000).toString(),
            }
        });

    }

    async deleteRegistration(userId: number, eventId: number): Promise<boolean> {

        const registrations = await this.getUserRegistrations(userId);
        const targetRegistration = registrations.find(registration => registration.eventId === eventId);

        if (!targetRegistration) {
            throw new HttpException('User not registered on this event!', HttpStatus.NOT_FOUND);
        }

        if (!([EventStatus.UPCOMING, EventStatus.OPEN] as EventStatus[]).includes(targetRegistration.event.status)) {
            throw new HttpException('Cannot unregister from event that is not in upcoming status', HttpStatus.FORBIDDEN);
        }

        await this.prismaClient.registration.deleteMany({
            where: {
                userId: userId,
                eventId: eventId,
            }
        });

        return true;
    }

    async getAvailableEvents(userId: number): Promise<Event[]> {

        const registrations = await this.getUserRegistrations(userId);

        const events = await this.prismaClient.event.findMany({
            where: {
                status: EventStatus.UPCOMING,
                NOT: {
                    id: {
                        in: registrations.map(registration => registration.eventId),
                    }
                }
            }
        });

        return events;
    }

    async getUserFinishedEvents(userId: number) {
        const participations: Participant[] = await this.prismaClient.participant.findMany({ where: { userId: userId } });

        return this.prismaClient.event.findMany({
            where: { 
                status: EventStatus.CLOSED,
                id: {
                    in: participations.map(participation => participation.eventId),
                }
             },
            
        })
    }

    async getUserRegistrations(userId: number): Promise<Array<Registration & { event: Event }>> {
        console.log(userId);
        return (await this.prismaClient.registration.findMany({
            where: {
                userId: userId,
            },
            include: {
                event: true,
            }
        })).filter(registration => ([EventStatus.UPCOMING, EventStatus.OPEN] as EventStatus[]).includes(registration.event.status));
    }

    async getUserParticipations(userId: number, statuses: EventStatus[] = [EventStatus.OPEN]): Promise<Array<Participant & { event: Event }>> {
        return (await this.prismaClient.participant.findMany({
            where: {
                userId: userId,
            },
            include: {
                event: true,
            }
        })).filter(participant => statuses.includes(participant.event.status));
    }

    async getEventDashboard(eventId: number): Promise<Event & any> {

        const event = await this.prismaClient.event.findUnique({
            where: {
                id: eventId,
            }
        });

        if (!event) {
            throw new HttpException('Event not found!', HttpStatus.NOT_FOUND);
        }

        const registrations = await this.prismaClient.registration.findMany({
            where: {
                eventId: eventId,
            },
            include: {
                user: true,
            }

        });

        const participants = await this.prismaClient.participant.findMany({
            where: {
                eventId: eventId,
            },
            include: {
                user: true,
            }
        });

        return {
            ...event,
            registrations: registrations,
            participants: participants,
        }
    }

    async validateAndFetchRegistration(userId: number, eventId: number, pin: string) {

        const registration = await this.prismaClient.registration.findFirst({
            where: {
                userId: userId,
                eventId: eventId,
            }
        });

        if (!registration) {
            throw new HttpException('Registration not found!', HttpStatus.NOT_FOUND);
        }

        if (registration.enrollmentPIN !== pin) {
            throw new HttpException('Invalid PIN!', HttpStatus.FORBIDDEN);
        }

        return registration;
    }

    async enrollOnEvent(registrationId: number): Promise<Participant> {

        const registration = await this.prismaClient.registration.findUnique({
            where: {
                id: registrationId,
            },
            include: {
                event: true,
            }
        });

        if (!registration) {
            throw new HttpException('Registration not found!', HttpStatus.NOT_FOUND);
        }

        if (registration.event.status !== EventStatus.OPEN) {
            throw new HttpException('Cannot enroll on event that is not in open status', HttpStatus.FORBIDDEN);
        }

        const participants = await this.prismaClient.participant.findMany({
            where: {
                eventId: registration.eventId,
            }
        });

        if (participants.some(participant => participant.userId === registration.userId)) {
            throw new HttpException('User already enrolled on this event!', HttpStatus.FORBIDDEN);
        }

        const participant = await this.prismaClient.participant.create({
            data: {
                userId: registration.userId,
                eventId: registration.eventId,
            }
        });

        await this.deleteRegistration(registration.userId, registration.eventId);

        return participant;
    }

}
