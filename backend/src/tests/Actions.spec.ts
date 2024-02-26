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

    const registerAndAddToEventNPeople = (eventId) => it('Can register, onboard and register N users for an event', async () => {
        const N = 15;
        const EVENT_ID = eventId;

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
                aboutMe: 'Test record which is same for every test user',
                contactsForLikes: 'Contacts for guys whom I liked +36'+(10 ** 9 + Math.round(Math.random() * 10 ** 8)),
                contactsForMatches: 'Contacts for guys who matched me +36'+(10 ** 9 + Math.round(Math.random() * 10 ** 8)),
            })
            return user;
        }
        const users = await Promise.all(emails.map(registerUser))
        await Promise.all(users.map(user => eventService.registerOnEvent(user.id, testSuit.eventId)));
    })

    const openEvent = (eventId) => it('Can open an event', async () => {
        await eventService.updateEvent(eventId, {

            status: EventStatus.OPEN,
        });
    })

    const enrollAllToEvent = (eventId) => it('Can enroll all users to an event', async () => {
        const EVENT_ID = eventId;
        const event = await prismaClient.event.findFirst({ where: { id: EVENT_ID } });
        const registrations = await prismaClient.registration.findMany({ where: { eventId: EVENT_ID } });

        const promises = registrations.map(async registration => {
            await eventService.enrollOnEvent(registration.id);
        })
        await Promise.all(promises);
    })

    const startGame = (eventId) => it('Can start a game', async () => {
        const game = await gameService.startGame(eventId);
    })


    const createLikes = (eventId) => it('Can create likes', async () => {
        const game = await gameUtilsService.getGameByEventId(eventId);
        const gameSetup: GameSetup = await gameService.getGameSetup(game.id);

        const participants = gameSetup.participants;
        const users = participants.map(p => p.user);
        const pIdtoUid = (pId) => participants.find(p => p.id === pId)?.userId;

        const promises = gameSetup.tableArrangements.map(async ta => {
            const aUid = pIdtoUid(ta.participantAId)
            const bUid = pIdtoUid(ta.participantBId)

            if (aUid && bUid) {
                if (Math.random() > 0.30) {
                    await gameResultService.setLike(game.id, aUid, bUid, true);
                }
                if (Math.random() > 0.30) {
                    await gameResultService.setLike(game.id, bUid, aUid, true);
                }

            }
        })

        await Promise.all(promises)
        const likeCount = await prismaClient.gameLike.count({ where: { gameId: game.id } });
        console.log('likeCount', likeCount);

    });

    const moveToNextRound = (eventId) => it('Can move to next round', async () => {
        const game = await gameUtilsService.getGameByEventId(eventId);
        const newGame = await gameService.moveGameToNextRound(game.id);
    });

    const setGameToTheBeginning = (eventId) => it('Can set game to the beginning', async () => {
        const game = await gameUtilsService.getGameByEventId(eventId);
        const gameSetup = await gameService.getGameSetup(game.id);
        const firstRound = gameSetup.rounds.find(round => round.index === 0).id;
        await prismaClient.event.update({ where: { id: eventId }, data: { status: EventStatus.RUNNING } });
        await prismaClient.game.update({ where: { id: game.id }, data: { currentRoundId: firstRound, status: GameStatus.RUNNING } });
    });

    const closeGame = (eventId) => it('Can close game', async () => {
        const game = await gameUtilsService.getGameByEventId(eventId);
        await prismaClient.game.update({ where: { id: game.id }, data: { status: GameStatus.FINAL } });
        await gameService.closeGame(game.id);
    })

    const eventId = 172;
    // registerAndAddToEventNPeople(eventId);
    // openEvent(eventId);
    // enrollAllToEvent(eventId);
    // startGame(eventId);
    createLikes(eventId);
    // moveToNextRound(eventId);
 
    // setGameToTheBeginning(eventId);
    closeGame(eventId);

})