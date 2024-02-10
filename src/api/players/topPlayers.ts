import { GET } from "../../router";
import { Request, Response } from "express";
import { IPlayerSS, IPlayerBL, IPlayerAS } from "../../types/players/players";
import { IPlayer } from "../../types/responses/players";
import apicache from "apicache";

function WeeklyChange(histories: string): number {
    const changes = histories.split(',').map(Number);
    if (changes.every((val, i, arr) => val === arr[0])) {
        return 0;
    }

    const weekAgo = changes[changes.length - 8];
    const today = changes[changes.length - 1];

    return weekAgo - today;
}

export class TopPlayers {
    @GET('api/players/top', apicache.middleware('10 hours'))
    async get(req: Request, res: Response) {
        const playersSS = await fetch('https://scoresaber.com/api/players', {
            method: 'GET'
        });

        if (playersSS.status !== 200) {
            return res.status(playersSS.status).json({
                error: true,
                message: 'An error occured while fetching the top players.'
            });
        }

        const playersArray = await playersSS.json();

        const players: IPlayerSS[] = playersArray.players;
        players.length = 10;

        const mapPlayersSS: IPlayer[] = players.map((player: IPlayerSS) => {
            return {
                rank: player.rank,
                avatar: player.profilePicture,
                name: player.name,
                pp: player.pp,
                change: WeeklyChange(player.histories)
            }
        });

        const playersBL = await fetch('https://api.beatleader.xyz/players?sortBy=pp&page=1&count=10&order=desc&mapsType=ranked&friends=false', {
            method: 'GET'
        });

        if (playersBL.status !== 200) {
            return res.status(playersBL.status).json({
                error: true,
                message: 'An error occured while fetching the top players.'
            });
        }

        const playersBLArray = await playersBL.json();

        const playersBLData: IPlayerBL[] = playersBLArray.data;

        const mapPlayersBL: IPlayer[] = playersBLData.map((player: IPlayerBL) => {
            return {
                rank: player.rank,
                avatar: player.avatar,
                name: player.name,
                pp: player.pp,
                change: player.lastWeekRank - player.rank
            }
        });

        const playersAS = await fetch('https://api.accsaber.com/categories/overall/standings', {
            method: 'GET'
        });

        if (playersAS.status !== 200) {
            return res.status(playersAS.status).json({
                error: true,
                message: 'An error occured while fetching the top players.'
            });
        }

        const playersASArray = await playersAS.json();
        playersASArray.length = 10;

        const mapPlayersAS: IPlayer[] = playersASArray.map((player: IPlayerAS) => {
            return {
                rank: player.rank,
                avatar: player.avatarUrl,
                name: player.playerName,
                pp: player.ap,
                change: player.rankLastWeek - player.rank
            }
        });

        res.status(200).json({
            scoresaber: mapPlayersSS,
            beatleader: mapPlayersBL,
            accsaber: mapPlayersAS
        })
    }
}