import { EventStatus, Game, GameLike, GameStatus, PrismaClient, ResutlType, Round, TableArrangement, User } from "@prisma/client";
import { EventsService } from "../modules/Event/events.service";
import { UserService } from "../modules/User/User.service";
import AuthService from "../modules/User/Auth.service";
import { GameService } from "../modules/Game/game.service";
import GameResultService from "../modules/Game/gameResult.service";
import { GameSetup } from "../types/game";
import GameUtilsService from "../modules/Game/gameUtils.service";

// Used for executing dev-related actions that can't be done via UI quickly.
// Don't add this to your CI! It produces side effects!
describe('Test-purpose actions, with side effects!', () => {

    let eventService: EventsService;
    let prismaClient: PrismaClient;
    let userService: UserService;
    let authService: AuthService;
    let gameService: GameService;
    let gameUtilsService: GameUtilsService;
    let gameResultService: GameResultService;

    beforeAll(() => {
        prismaClient = new PrismaClient();
        eventService = new EventsService(prismaClient);
        authService = new AuthService(prismaClient);
        userService = new UserService(prismaClient, authService);
        gameUtilsService = new GameUtilsService(prismaClient);
        gameResultService = new GameResultService(prismaClient, userService, gameUtilsService);
        gameService = new GameService(prismaClient, gameResultService, gameUtilsService);

    })

    const registerAndAddToEventNPeople = () => it('Can register, onboard and register N users for an event', async () => {
        const N = 9;
        const EVENT_ID = 157;

        const testSuit = {
            emails: new Array(N).fill(0).map((_, i) => `test-${i}-${Math.round(Math.random() * 10 ** 8)}@example.com`),
            eventId: EVENT_ID,
        }

        const getUsers = async () => await prismaClient.user.findMany({ where: { email: { in: testSuit.emails } } });
        const getEvent = async () => await prismaClient.event.findFirst({ where: { id: testSuit.eventId } });

        const { emails } = testSuit;

        const registerUser = async (email) => {
            const user = (await userService.registerUser(email, '12345678')).user;
            await userService.putOnboardingData(user.id, {
                phone: '' + (10 ** 9 + Math.round(Math.random() * 10 ** 8)),
                name: 'Test - ' + Math.round(Math.random() * 10 ** 5),
                nickname: 'Test',
                aboutMe: 'Test',
            })
            return user;
        }
        const users = await Promise.all(emails.map(registerUser))
        await Promise.all(users.map(user => eventService.registerOnEvent(user.id, testSuit.eventId)));
    })


    registerAndAddToEventNPeople();
})