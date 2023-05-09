import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event, EventStatus, PrismaClient } from '@prisma/client';

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

    async updateEvent(eventId: number, eventData: Event): Promise<Event> {

        const event = await this.prismaClient.event.findUnique({
            where: {
                id: eventId,
            }
        });

        if (!([EventStatus.DRAFT, EventStatus.UPCOMING] as EventStatus[]).includes(event.status)) {
            throw new HttpException('Cannot update event that is not in draft or upcoming status', HttpStatus.FORBIDDEN);
        }

        return await this.prismaClient.event.update({
            where: {
                id: eventId,
            },
            data: {
                title: eventData.title,
                description: eventData.description,
                location: eventData.location,
                price: eventData.price,
                participantLimit: eventData.participantLimit,
                datetime: eventData.datetime,
                status: eventData.status,
            }
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
}
