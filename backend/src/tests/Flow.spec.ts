import { EventStatus, PrismaClient } from "@prisma/client";
import { EventsService } from "../modules/Event/events.service";
import { UserService } from "../modules/User/User.service";
import AuthService from "../modules/User/Auth.service";
import { GameService } from "../modules/Game/game.service";

describe('Main app flow test', () => {

    let eventService: EventsService;
    let prismaClient: PrismaClient;
    let userService: UserService;
    let authService: AuthService;
    let gameService: GameService;

    beforeEach(() => {
        prismaClient = new PrismaClient();
        eventService = new EventsService(prismaClient);
        authService = new AuthService(prismaClient);
        userService = new UserService(prismaClient, authService);
        gameService = new GameService(prismaClient);

    })

    describe('Game testing', () => {

        const passThrough = {
            events: []
        }

        const testSuit = {
            emails: new Array(10).fill(0).map((_, i) => `test-${i}@example.com`),
            eventData: {
                title: 'Test Event ' + new Date().getTime(),
                description: 'Test Description',
                location: 'Test Location',
                participantLimit: 10,
                price: 1000 + ' HUF',
                datetime: new Date(),
            }
        }

        const getUsers = async () => await prismaClient.user.findMany({
            where: {
                email: {
                    in: testSuit.emails
                }
            }
        });


        const getEvent = async () => prismaClient.event.findFirst({
            where: {
                title: testSuit.eventData.title
            }
        });

        const getGame = async () => prismaClient.game.findFirst({
            where: { eventId: (await getEvent()).id }
        });


        it('Can load all events', async () => {
            const events = await eventService.getEvents();
            const dbEvents = await prismaClient.event.findMany();
            passThrough.events = events;

            expect(events).toHaveLength(dbEvents.length);
        })

        it('Specific amount of events', async () => {
            expect(passThrough.events.length).toBeGreaterThan(0);
        })

        // Step 1. Register N users
        it('Register several users', async () => {
            const { emails } = testSuit;

            const registerUser = async (email) => {
                const user = (await userService.registerUser(email, '12345678')).user;
                await userService.putOnboardingData(user.id, {
                    phone: '12345678',
                    name: 'Test',
                    nickname: 'Test',
                    aboutMe: 'Test',
                })

                const dbUser = await prismaClient.user.findUnique({ where: { email } });
                expect(dbUser).toBeDefined();
                expect(dbUser.id).toBe(user.id);
                expect(dbUser.email).toBe(email);
                expect(dbUser.phone).toBe('12345678');

                return user;
            }

            const users = await Promise.all(emails.map(registerUser))
            expect(users).toHaveLength(emails.length);
            console.log(`Created ${users.length} users.`);
        })

        // Step 2. Create event and put in appropriate status
        it('Creating event to play with...', async () => {

            const { eventData } = testSuit;

            const event = await eventService.createEvent({
                title: eventData.title,
                description: eventData.description,
                location: eventData.location,
                participantLimit: eventData.participantLimit,
                price: eventData.price,
                datetime: eventData.datetime,
                status: EventStatus.UPCOMING,
                id: -1
            });

            const dbEvent = await prismaClient.event.findFirst({
                where: { title: eventData.title }
            })

            expect(dbEvent).toBeDefined();
            expect(dbEvent.title).toBe(event.title);
            expect(dbEvent.description).toBe(event.description);
            expect(dbEvent.location).toBe(event.location);
            expect(dbEvent.participantLimit).toBe(event.participantLimit);
            expect(dbEvent.price).toBe(event.price);
            expect(dbEvent.datetime.getTime()).toBe(event.datetime.getTime());

            console.log(`Created event: ${event.title}`);
        })

        // Step 3. Register all users to this event
        it('Registering all users on events', async () => {
            const users = await getUsers();
            const event = await getEvent();

            await Promise.all(users.map(user => eventService.registerOnEvent(user.id, event.id)));

            const dbRegistrations = await prismaClient.registration.findMany({
                where: {
                    eventId: event.id
                }
            });

            expect(dbRegistrations).toHaveLength(users.length);
        })

        // Step 4. Open event for enrollment
        it('Opening event for enrollment', async () => {
            const event = await getEvent();

            await eventService.updateEvent(event.id, {
                status: EventStatus.OPEN
            });

            const dbEvent = await prismaClient.event.findUnique({
                where: {
                    id: event.id
                }
            });

            expect(dbEvent.status).toBe(EventStatus.OPEN);
        })


        // Step 5. Enroll all users to event
        it('Enrolls all users to event', async () => {
            const event = await getEvent();
            const registrations = await prismaClient.registration.findMany({
                where: {
                    eventId: event.id
                }
            });

            await Promise.all(registrations.map(r => eventService.enrollOnEvent(r.id)));

            const participants = await prismaClient.participant.findMany({ where: { eventId: event.id } });
            
            expect(participants).toHaveLength(registrations.length);
        });

        // Step 6. Start game
        it('Starts game', async () => {
            const event = await getEvent();

            const game = await gameService.startGame(event.id);
            console.log(game);

            const dbEvent = await prismaClient.event.findUnique({
                where: {
                    id: event.id
                }
            });

            // Check rounds count
            // Check tables count
            // Check table arrangements count and data

            expect(dbEvent.status).toBe(EventStatus.RUNNING);
        });
        


        afterAll(async () => {

            const { emails, eventData } = testSuit;

            const event = await getEvent();
            const game = await getGame();

            const tables = await prismaClient.table.findMany({ where: { gameId: game.id } });
            await Promise.all(tables.map(table => prismaClient.tableArrangement.deleteMany({ where: { tableId: table.id } })));
            await prismaClient.table.deleteMany({ where: { gameId: game.id } });
            await prismaClient.round.deleteMany({ where: { gameId: game.id } });
            await prismaClient.game.deleteMany({ where: { id: game.id } })


            await prismaClient.participant.deleteMany({ where: { eventId: event.id } })
            await prismaClient.registration.deleteMany({ where: { eventId: event.id } })

            const deleteUser = async (email) => {

                const user = await prismaClient.user.findUnique({ where: { email } });
                await prismaClient.userAuth.deleteMany({ where: { userId: user.id } })
                await prismaClient.user.deleteMany({ where: { id: user.id } })
                await prismaClient.$disconnect();
            }

            await Promise.all(emails.map(deleteUser));

            await prismaClient.event.deleteMany({ where: { title: eventData.title } })
        })
    })
})