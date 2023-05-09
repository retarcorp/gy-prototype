import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { AdminOnly, WithAuth } from '../User/Auth.guards';
import { EventStatus } from '@prisma/client';

@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
    ) {}

    @Get('/events/')
    @WithAuth()
    async getEvents(): Promise<any> {
        const events = await this.eventsService.getEvents([EventStatus.UPCOMING]);
        return { events };
    }

    @Get('/events/editable')
    @AdminOnly()
    async getEditableEvents(): Promise<any> {
        const events = await this.eventsService.getEvents([EventStatus.UPCOMING, EventStatus.DRAFT]);
    }

    @Get('/events/:id')
    @WithAuth()
    async getEvent(): Promise<any> {
        // TODO
    }

    @Post('/events/')
    @AdminOnly()
    async createEvent(@Body() eventData: any): Promise<any> {
        return await this.eventsService.createEvent(eventData);
    }

    @Delete('/events/:id')
    @AdminOnly()
    async deleteEvent(@Param('id', ParseIntPipe) eventId: number): Promise<any> {
        return await this.eventsService.deleteEvent(eventId);
    }

    @Post('/events/:id')
    @AdminOnly()
    async updateEvent(@Param('id', ParseIntPipe) eventId: number, @Body() eventData: any): Promise<any> {
        return await this.eventsService.updateEvent(eventId, eventData);
    }

}  
