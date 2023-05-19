import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { AdminOnly, CurrentUser, WithAuth } from '../User/Auth.guards';
import { Event, EventStatus, Participant, Registration } from '@prisma/client';

@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
    ) { }

    @Get('/')
    @WithAuth()
    async getEvents(): Promise<any> {
        const events = await this.eventsService.getEvents([EventStatus.UPCOMING]);
        return { events };
    }

    @Get('/editable')
    @AdminOnly()
    async getEditableEvents(): Promise<any> {
        return await this.eventsService.getEvents([EventStatus.UPCOMING, EventStatus.DRAFT]);
    }

    @Get('/viewable')
    @AdminOnly()
    async getViewableEvents(): Promise<any> {
        return await this.eventsService.getEvents([EventStatus.UPCOMING, EventStatus.DRAFT, EventStatus.OPEN, EventStatus.RUNNING, EventStatus.FINAL, EventStatus.CLOSED]);
    }


    @Get('/:id/dashboard')
    @AdminOnly()
    async getEventDashboard(@Param('id', ParseIntPipe) eventId: number): Promise<any> {
        return await this.eventsService.getEventDashboard(eventId);
    }

    @Post('/')
    @AdminOnly()
    async createEvent(@Body() eventData: any): Promise<any> {
        const validatedData = {
            ...eventData,
            participantLimit: parseInt(eventData.participantLimit),
            datetime: new Date(eventData.datetime)
        }
        return await this.eventsService.createEvent(validatedData);
    }

    @Delete('/:id')
    @AdminOnly()
    async deleteEvent(@Param('id', ParseIntPipe) eventId: number): Promise<any> {
        return await this.eventsService.deleteEvent(eventId);
    }

    @Post('/:id')
    @AdminOnly()
    async updateEvent(@Param('id', ParseIntPipe) eventId: number, @Body() eventData: any): Promise<any> {
        return await this.eventsService.updateEvent(eventId, eventData);
    }

    @Post('/:id/registration')
    @WithAuth()
    async registerForEvent(
        @CurrentUser('id', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) eventId: number
    ): Promise<any> {

        return await this.eventsService.registerOnEvent(userId, eventId);
    }

    @Delete('/:id/registration')
    @WithAuth()
    async unregisterFromEvent(
        @CurrentUser('id', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) eventId: number
    ): Promise<any> {

        const result = await this.eventsService.deleteRegistration(userId, eventId);
        return {
            eventId,
            result
        }
    }

    @Get('/available')
    @WithAuth()
    async getAvailableEvents(
        @CurrentUser('id', ParseIntPipe) userId: number
    ): Promise<Event[]> {
        return await this.eventsService.getAvailableEvents(userId);
    }

    @Get('/registered')
    @WithAuth()
    async getRegisteredEvents(
        @CurrentUser('id', ParseIntPipe) userId: number
    ): Promise<Array<Registration & {event: Event}>> {
        return await this.eventsService.getUserRegistrations(userId);
    }

    @Get('/participated')
    @WithAuth()
    async getParticipatedEvents(
        @CurrentUser('id', ParseIntPipe) userId: number
    ): Promise<Array<Participant & {event: Event}>> {
        return await this.eventsService.getUserParticipations(userId);
    }

    @Get('/:id/registration/validate/:userId/:pin')
    @AdminOnly()
    async validateRegisteration(
        @Param('id', ParseIntPipe) eventId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Param('pin') pin: string
    ): Promise<any> {
        try {
            await this.eventsService.validateAndFetchRegistration(userId, eventId, pin);
            return { 
                valid: true
            }
        } catch (e) {
            return {
                valid: false
            }
        }
    }

    @Post('/:id/registration/validate/:userId/:pin')
    @AdminOnly()
    async validateRegisterationAndParticipate(
        @Param('id', ParseIntPipe) eventId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Param('pin') pin: string
    ): Promise<any> {
        
        const registration = await this.eventsService.validateAndFetchRegistration(userId, eventId, pin);
        const participant = await this.eventsService.enrollOnEvent(registration.id);

        return participant;
    }

    @Delete('/:id/participation/:userId')
    @AdminOnly()
    async unEnrollUser(
        @Param('id', ParseIntPipe) eventId: number,
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<Registration> {
        const result: Registration = await this.eventsService.unEnrollUser(userId, eventId);
        return result
    }

    @Get('/:id/participation/my/validate') 
    @WithAuth()
    async validateMyParticipation(
        @CurrentUser('id', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) eventId: number
    ): Promise<{participation: Participant | null}> {
        const participations = await this.eventsService.getUserParticipations(userId, [EventStatus.OPEN, EventStatus.RUNNING, EventStatus.FINAL]);
        
        const participation = participations.find(p => p.eventId === eventId);
        return { participation: participation || null };
    }


}  
