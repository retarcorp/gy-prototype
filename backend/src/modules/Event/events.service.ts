import { Injectable } from '@nestjs/common';
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
        return await this.prismaClient.event.delete({
            where: {
                id: eventId,
            }
        })
    }
}
