import { EventStatus, Game, GameLike, GameStatus, PrismaClient, ResutlType, Round, TableArrangement, User } from "@prisma/client";
import { EventsService } from "../modules/Event/events.service";
import { UserService } from "../modules/User/User.service";
import AuthService from "../modules/User/Auth.service";
import { GameService } from "../modules/Game/game.service";
import GameResultService from "../modules/Game/gameResult.service";
import { GameSetup } from "../types/game";
import GameUtilsService from "../modules/Game/gameUtils.service";

describe('Main app flow test', () => {

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

    describe('Game testing', () => {

        const passThrough = {
            events: []
        }

        const N = 9;

        const testSuit = {
            emails: new Array(N).fill(0).map((_, i) => `test-${i}-${Math.round(Math.random() * 10 ** 8)}@example.com`),
            eventData: {
                title: 'Test Event ' + new Date().getTime(),
                description: 'Test Description',
                location: 'Test Location',
                participantLimit: 20,
                price: 1000 + ' HUF',
                datetime: new Date(),
            }
        }

        const Rn = N - 1 + (N % 2);
        const actionsSetup = new Array(Rn).fill(0).map(() => ({
            like: Math.random() > 0.5,
            note: `Test note ${Math.round(Math.random() * 10 ** 9)}`
        }))

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

        // Step X. User can display his enrollment creds
        // Step X. User can poll enrollment status for the event and see when he was enrolled


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
            const dbEvent = await prismaClient.event.findUnique({
                where: {
                    id: event.id
                }
            });

            const participants = await prismaClient.participant.findMany({ where: { eventId: event.id } });
            expect(participants.every(p => p.gameId === game.id)).toBeTruthy();

            // Check rounds count
            const dbRounds = await prismaClient.round.findMany({ where: { gameId: game.id } });
            expect(dbRounds).toHaveLength(Math.ceil(participants.length / 2) * 2 - 1);

            // Check tables count
            // Check table arrangements count and data

            expect(dbEvent.status).toBe(EventStatus.RUNNING);
        });

        // Step X. Move game to next round
        it('Game can move to the next rounds till final', async () => {

            const mainGame = await getGame();
            const gameSetup = await gameService.getGameSetup(mainGame.id);
            const dbRounds = await prismaClient.round.findMany({ where: { gameId: mainGame.id } });

            for (let i = 1; i < dbRounds.length; i++) {
                await gameService.moveGameToNextRound(mainGame.id);
                const game = await getGame();

                const expectedRoundId = gameSetup.rounds[i].id;
                expect(game.currentRoundId).toBe(expectedRoundId);

                const roundSetup = await gameService.getCurrentRoundSetup(game.id);
                expect(roundSetup).toBeDefined();
                expect(roundSetup.index).toBe(i);
                expect(roundSetup.id).toBe(expectedRoundId);
            }
            // Now we're on final round


        })

        const setGameToStart = async (): Promise<Game> => {
            const game = await getGame();
            const rounds = await prismaClient.round.findMany({ where: { gameId: game.id } });
            const firstRound = rounds.find(r => r.index === 0);
            await prismaClient.game.update({ where: { id: game.id }, data: { currentRoundId: firstRound.id } });
            const roundSetup = await gameService.getCurrentRoundSetup(game.id);
            expect(roundSetup.id).toBe(firstRound.id);
            return await getGame();
        }

        // Step X. User can poll current round and see that round has changed
        it('User can poll game and see the current game setup', async () => {
            // const user = await prismaClient.user.findFirst({ where: { email: testSuit.emails[0] } });
            const game = await setGameToStart();

            const gameSetup = await gameService.getGameSetup(game.id);
            for (let i = 0; i < gameSetup.rounds.length; i++) {
                const roundSetup = await gameService.getCurrentRoundSetup(game.id);
                expect(roundSetup).toBeDefined();
                expect(roundSetup.index).toBe(i);
                await gameService.moveGameToNextRound(game.id);
            }

        })

        // Step X. User may put likes
        it('User can save likes for a user', async () => {
            const user = await prismaClient.user.findFirst({ where: { email: testSuit.emails[0] } });
            const game = await setGameToStart();
            const gameSetup = await gameService.getGameSetup(game.id);

            const checkRound = async () => {

                const roundSetup = await gameService.getCurrentRoundSetup(game.id);
                const pId = await gameService.getParticipantIdByUserId(user.id, game.id);

                const userTableArrangement = roundSetup.tableArrangements.find(ta => ta.participantAId === pId || ta.participantBId === pId);
                const userPartnerPId = userTableArrangement.participantAId === pId ? userTableArrangement.participantBId : userTableArrangement.participantAId;

                if (userPartnerPId === null) {
                    return;
                }
                expect(userPartnerPId).not.toBe(pId);
                const partnerUid = await gameService.getUserIdByParticipantId(userPartnerPId);

                const likes = await gameResultService.getGameUserLikes(game.id, user.id);
                expect(likes).toHaveLength(0);

                await gameResultService.toggleLike(game.id, user.id, partnerUid);
                const likesAfter = await gameResultService.getGameUserLikes(game.id, user.id);
                expect(likesAfter).toHaveLength(1);

                const partnerLikes = await gameResultService.getGameUserLikes(game.id, partnerUid);
                expect(partnerLikes).toHaveLength(0);

                await gameResultService.toggleLike(game.id, user.id, partnerUid);
                const likesAfter2 = await gameResultService.getGameUserLikes(game.id, user.id);
                expect(likesAfter2).toHaveLength(0);
            }

            for (let i = 0; i < gameSetup.rounds.length; i++) {
                await checkRound();
                await gameService.moveGameToNextRound(game.id);
            }

        })

        // Step X. User may save notes
        it('User can save notes for a user', async () => {
            const user = await prismaClient.user.findFirst({ where: { email: testSuit.emails[0] } });
            const game = await setGameToStart();
            const gameSetup = await gameService.getGameSetup(game.id);

            const rounds = await prismaClient.round.findMany({ where: { gameId: game.id } });
            const firstRound = rounds.find(r => r.index === 0);
            await prismaClient.game.update({ where: { id: game.id }, data: { currentRoundId: firstRound.id } });

            const getNoteText = (uid, pid) => `Test note from ${uid} to user ${pid} replaced in a game ${game.id}`;

            const runRound = async () => {
                const roundSetup = await gameService.getCurrentRoundSetup(game.id);
                const pId = await gameService.getParticipantIdByUserId(user.id, game.id);

                const userTableArrangement = roundSetup.tableArrangements.find(ta => ta.participantAId === pId || ta.participantBId === pId);
                const userPartnerPId = userTableArrangement.participantAId === pId ? userTableArrangement.participantBId : userTableArrangement.participantAId;

                if (userPartnerPId === null) {
                    return;
                }
                expect(userPartnerPId).not.toBe(pId);
                const partnerUid = await gameService.getUserIdByParticipantId(userPartnerPId);

                await gameResultService.setNote(user.id, partnerUid, getNoteText(user.id, partnerUid));

            }

            for (let i = 0; i < gameSetup.rounds.length; i++) {
                await runRound();
                await gameService.moveGameToNextRound(game.id);
            }

            const notes = await gameResultService.getUserNotes(user.id);
            expect(notes.length).toBeGreaterThanOrEqual(gameSetup.rounds.length - 1);
        })


        // Step X. User may see total results and save notes and put likes
        it('User can get valid preliminary results and change them', async () => {
            const game = await setGameToStart();
            const gameSetup: GameSetup = await gameService.getGameSetup(game.id);
            const rounds: Round[] = gameSetup.rounds;
            const user = await prismaClient.user.findFirst({ where: { email: testSuit.emails[0] } });
            const pId = await gameService.getParticipantIdByUserId(user.id, game.id);

            const runRound = async () => {
                const roundSetup = await gameService.getCurrentRoundSetup(game.id);
                const tableArrangement = roundSetup.tableArrangements.find(ta => ta.participantAId === pId || ta.participantBId === pId);
                const partnerPId = tableArrangement.participantAId === pId ? tableArrangement.participantBId : tableArrangement.participantAId;
                if (partnerPId !== null) {

                    const partnerUid = await gameService.getUserIdByParticipantId(partnerPId);

                    expect(partnerPId).not.toEqual(pId);
                    expect(partnerUid).not.toEqual(user.id);
                    const action = actionsSetup[roundSetup.index];
                    if (!action) {
                        console.log(roundSetup.index, actionsSetup, gameSetup.rounds);
                    }
                    if (action.like) {
                        await gameResultService.toggleLike(game.id, user.id, partnerUid);
                    }
                    await gameResultService.setNote(user.id, partnerUid, action.note);
                }

                await gameService.moveGameToNextRound(game.id);
            }

            for (let i = 0; i < gameSetup.rounds.length; i++) {
                await runRound();
            }

            const preliminaryResults = await gameResultService.getGameUserPreliminaryResults(game.id, user.id);
            const likesCount = actionsSetup.reduce((count, { like }) => count + Number(like), 0)

            expect(preliminaryResults.likes.length).toBeGreaterThanOrEqual(likesCount - 1);
            expect(preliminaryResults.notes.length).toBeGreaterThanOrEqual(actionsSetup.length - 1);

            actionsSetup.forEach(({ like, note }, i) => {
                const tableArrangements = gameSetup.tableArrangements.filter(ta => ta.roundId === rounds[i].id);
                const targetArrangement: TableArrangement = tableArrangements.find(ta => ta.participantAId === pId || ta.participantBId === pId);
                const partnerPId: number | null = targetArrangement.participantAId === pId ? targetArrangement.participantBId : targetArrangement.participantAId;
                const targetUId = gameSetup.participants.find(p => p.id === partnerPId)?.userId || null;

                if (targetUId !== null) {
                    if (like) {
                        const likeToCheck = preliminaryResults.likes.find(l => (l.userId === user.id && l.targetUserId === targetUId));
                        expect(likeToCheck.targetUserId).toBe(targetUId);
                        expect(likeToCheck.userId).toBe(user.id)
                        expect(likeToCheck.gameId).toBe(game.id)
                    }

                    const noteToCheck = preliminaryResults.notes.find(n => n.targetUserId === targetUId);
                    expect(noteToCheck.userId).toBe(user.id);
                    expect(noteToCheck.notes).toBe(note);
                }
            })
        })

        const likesTable = new Array(testSuit.emails.length)
            .fill(0)
            .map(() => new Array(testSuit.emails.length)
                .fill(0)
                .map(() => Math.random() > 0.5)
            )
            
        // Step X. Setting up likes table for checking matches afterwards
        it('Setting up likes generates correct DB records and allows to calculate results later', async () => {
            const users = await prismaClient.user.findMany({ where: { email: { in: testSuit.emails } } });
            const game = await setGameToStart();

            const dbLikes = await prismaClient.gameLike.findMany({ where: { gameId: game.id } });

            const promises = likesTable.map((row, i) => {
                const userId = users[i].id;
                return Promise.all(row.map(async (like, j) => {
                    const targetUserId = users[j].id;
                    if (like) {
                        await gameResultService.toggleLike(game.id, userId, targetUserId)
                    }
                }))
            })
            await Promise.all(promises);

            const toggledLikesCount = likesTable.flatMap(row => row.filter(Boolean)).length;
            const dbLikesAfter = await prismaClient.gameLike.findMany({ where: { gameId: game.id } });

            expect(dbLikesAfter.length).toBeLessThanOrEqual(toggledLikesCount + dbLikes.length);
            expect(dbLikesAfter.length).toBeGreaterThanOrEqual(dbLikes.length - toggledLikesCount);
        })


        // Step X. Finalize game
        it('Game can be finalized', async () => {
            const mainGame = await getGame();
            const rounds = await prismaClient.round.findMany({ where: { gameId: mainGame.id } });
            const finalRound = rounds.find(r => r.index === rounds.length - 1);
            await prismaClient.game.update({ where: { id: mainGame.id }, data: { currentRoundId: finalRound.id } });


            await gameService.moveGameToNextRound(mainGame.id);
            const game = await getGame();

            expect(game.currentRoundId).toBe(null);
            expect(game.status).toBe(GameStatus.FINAL);

            const event = await getEvent();
            expect(event.status).toBe(EventStatus.FINAL);
        })

        // Step X. Close game
        it('Game can be closed', async () => {
            const game = await getGame();
            await gameService.closeGame(game.id);
            const closedGame = await getGame();

            expect(closedGame.status).toBe(GameStatus.CLOSED);
            const event = await getEvent();

            expect(event.status).toBe(EventStatus.CLOSED);

            const user1 = await prismaClient.user.findFirst({ where: { email: testSuit.emails[0] } });
            const user2 = await prismaClient.user.findFirst({ where: { email: testSuit.emails[1] } });

            const putLike = async () => {
                await gameResultService.toggleLike(game.id, user1.id, user2.id);
            }

            expect(putLike).rejects.toThrow();

        })

        // Step X. User may see the results of a game - likes, contacts, notes
        // -- Before closing and finalizing game, add some likes to make test results
        it('User can view game results with likes, matches and corresponding contacts', async () => {
            const user = await prismaClient.user.findFirst({ where: { email: testSuit.emails[0] }})
            const game = await getGame();
            const event = await getEvent();

            const results = await gameResultService.getUserGameResults(user.id, game.id);
            const onewayResults = results.filter(r => r.type === ResutlType.LIKEDBY);
            const matches = results.filter(r => r.type === ResutlType.MATCH);

            const likesAsTarget: GameLike[] = await prismaClient.gameLike.findMany({ where: { targetUserId: user.id } });
            const likesAsAuthor: GameLike[] = await prismaClient.gameLike.findMany({ where: { userId: user.id } });
            const expectedResultsCount = likesAsTarget.length;
            const expectedMatchesCount = likesAsAuthor.filter(laa => likesAsTarget.some(lat => lat.userId === laa.targetUserId)).length;

            expect(results.length).toBeGreaterThanOrEqual(expectedResultsCount);
            expect(onewayResults.length).toBe(expectedResultsCount - expectedMatchesCount);
            expect(matches.length).toBe(expectedMatchesCount);

        })


        // Step X. User may see that event was added to his list of attended after event was finished
        it('User can see event in his list of attended events', async () => { 
            const user: User = await prismaClient.user.findFirst({ where: { email: testSuit.emails[0] }})
            const events = await eventService.getUserFinishedEvents(user.id);
            const event = await getEvent();

            expect(events.every(e => e.status === EventStatus.CLOSED));
            expect(events.some(e => e.id === event.id)).toBe(true);

        })

        // Step X. User may see list of past events and see their results
        it('User can see previous events and results of them', async () => {
            const user: User = await prismaClient.user.findFirst({ where: { email: testSuit.emails[0] }})
            const attendedEvents = await eventService.getUserFinishedEvents(user.id);

            await Promise.all(attendedEvents.map(async (event) => {
                const game = await gameUtilsService.getGameByEventId(event.id);
                const results = await gameResultService.getUserGameResults(user.id, game.id);
                const onewayResults = results.filter(r => r.type === ResutlType.LIKEDBY);
                const matches = results.filter(r => r.type === ResutlType.MATCH);
                expect(results.length).toBeGreaterThanOrEqual(onewayResults.length);
                expect(results.length).toBeGreaterThanOrEqual(matches.length);
            }))
        })




        // Cleaning the DB after all tests
        afterAll(async () => {

            const { emails, eventData } = testSuit;

            const event = await getEvent();
            const game = await getGame();

            const results = await prismaClient.gameUserResultRecord.deleteMany( { where: { gameId: game.id }});
            const users = await prismaClient.user.findMany({ where: { email: { in: emails } } })

            await prismaClient.userNotes.deleteMany({ where: { userId: { in: users.map(u => u.id) } } })
            await prismaClient.gameLike.deleteMany({ where: { gameId: game.id } });

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
            }

            await Promise.all(emails.map(deleteUser));

            await prismaClient.event.deleteMany({ where: { title: eventData.title } })
        })
    })
})