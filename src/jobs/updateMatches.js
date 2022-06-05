const { getClan, getBattleLog } = require("../util/api")
const { LOGS_CHANNEL_ID } = require("../../config")
const { parseDate, isWinner } = require("../util/functions")
const specialGameModes = require("../static/specialGamemodes")
const createMatchImg = require("../util/createMatchImgs")

module.exports = {
	expression: "*/4 * * * *", //every 5 mins
	run: async (client, db) => {
		console.log("Updating matches...")

		const afamLogs = db.collection("AFam Logs")

		//get member list
		//loop through all members
		//loop through members of each member

		const clan = await getClan("9U82JJ0Y").catch(console.log)
		if (!clan) return

		const { memberList } = clan

		const matchQueue = []

		for (const m of memberList) {
			const log = await getBattleLog(m.tag)

			for (let i = log.length - 1; i >= 0; i--) {
				const b = log[i]

				let match

				const player = b.team[0]
				const opponent = b.opponent[0]

				if (b.type === "riverRacePvP") {
					//battle
					if (b.gameMode.name === "CW_Battle_1v1") {
						//standard 1v1
						match = {
							type: "1v1 Battle",
							iconPath: "cw-battle-1v1",
							timestamp: b.battleTime,
							isWon: player.crowns > opponent.crowns,
							isDraw: player.crowns === opponent.crowns,
							team: {
								name: player.name,
								tag: player.tag,
								clanName: player.clan.name,
								trophies: player.startingTrophies || 0,
								cards: player.cards,
								crowns: player.crowns,
							},
							opponent: {
								name: opponent.name,
								tag: opponent.tag,
								clanName: opponent.clan.name,
								trophies: opponent.startingTrophies || 0,
								cards: opponent.cards,
								crowns: opponent.crowns,
							},
						}
					} else {
						const modeExists = specialGameModes.find((m) => m.name === b.gameMode.name)

						if (modeExists) {
							match = {
								type: modeExists.str,
								iconPath: modeExists.iconPath,
								timestamp: b.battleTime,
								isWon: player.crowns > opponent.crowns,
								isDraw: player.crowns === opponent.crowns,
								team: {
									name: player.name,
									tag: player.tag,
									clanName: player.clan.name,
									trophies: player.startingTrophies || 0,
									cards: player.cards,
									crowns: player.crowns,
								},
								opponent: {
									name: opponent.name,
									tag: opponent.tag,
									clanName: opponent.clan.name,
									trophies: opponent.startingTrophies || 0,
									cards: opponent.cards,
									crowns: opponent.crowns,
								},
							}
						}
					}
				} else if (b.type === "riverRaceDuel" || b.type === "riverRaceDuelColosseum") {
					//duel
					match = {
						type: "1v1 Duel",
						iconPath: "cw-duel-1v1",
						timestamp: b.battleTime,
						isWon: isWinner(player.crowns, opponent.crowns, player.cards / 8),
						team: {
							name: player.name,
							tag: player.tag,
							clanName: player.clan.name,
							trophies: player.startingTrophies || 0,
							cards: player.cards,
							crowns: player.crowns,
						},
						opponent: {
							name: opponent.name,
							tag: opponent.tag,
							clanName: opponent.clan.name,
							trophies: opponent.startingTrophies || 0,
							cards: opponent.cards,
							crowns: opponent.crowns,
						},
					}
				} else if (b.type === "boatBattle" && b.boatBattleSide === "attacker" && b.gameMode.name === "ClanWar_BoatBattle") {
					//boat battle
					match = {
						type: "Boat Battle",
						iconPath: "cw-boat-battle",
						timestamp: b.battleTime,
						isWon: b.boatBattleWon,
						team: {
							name: player.name,
							tag: player.tag,
							clanName: player.clan.name,
							cards: player.cards,
							towersDestroyed: b.newTowersDestroyed,
							towersRemaining: b.remainingTowers,
						},
						opponent: {
							name: opponent.name,
							tag: opponent.tag,
							clanName: opponent.clan.name,
							cards: opponent.cards,
						},
					}
				}

				if (match) {
					//check if from our clan
					if (player.clan.tag !== clan.tag) continue
					//check if already in database
					const matchFound = await afamLogs.findOne({ "team.tag": m.tag, timestamp: b.battleTime })
					if (matchFound) continue

					matchQueue.push(match)
				}
			}
		}

		matchQueue.sort((a, b) => parseDate(a.timestamp) - parseDate(b.timestamp))

		for (const m of matchQueue) {
			try {
				//send match info
				await client.channels.cache.get(LOGS_CHANNEL_ID).send(`**${m.team.name}** vs. **${m.opponent.clanName}** :arrow_down:`)

				//send image
				await client.channels.cache.get(LOGS_CHANNEL_ID).send({ files: [await createMatchImg(m)] })

				//add to database
				afamLogs.insertOne(m)
			} catch (e) {
				console.log(e)
			}
		}
	},
}
