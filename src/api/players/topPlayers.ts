import { GET } from "../../router";
import { Request, Response } from "express";
import { IPlayerSS, IPlayerBL, IPlayerAS } from "../../types/players/players";
import { IPlayer } from "../../types/responses/players";
import apicache from "apicache";

type LeaderboardResult = {
  players: IPlayer[];
  error: string | null;
};

function WeeklyChange(histories: string): number {
  const changes = histories.split(",").map(Number).filter(Number.isFinite);

  if (changes.length < 8) {
    return 0;
  }

  if (changes.every((val, i, arr) => val === arr[0])) {
    return 0;
  }

  const weekAgo = changes[changes.length - 8];
  const today = changes[changes.length - 1];

  return weekAgo - today;
}

async function fetchScoreSaberPlayers(): Promise<IPlayer[]> {
  const playersSS = await fetch("https://scoresaber.com/api/players", {
    method: "GET",
  });

  if (!playersSS.ok) {
    throw new Error(`ScoreSaber returned ${playersSS.status}`);
  }

  const playersArray = await playersSS.json();

  const players: IPlayerSS[] = (playersArray.players ?? []).slice(0, 10);

  return players.map((player: IPlayerSS) => {
    return {
      rank: player.rank,
      avatar: player.profilePicture,
      name: player.name,
      pp: player.pp,
      change: WeeklyChange(player.histories),
    };
  });
}

async function fetchBeatLeaderPlayers(): Promise<IPlayer[]> {
  const playersBL = await fetch(
    "https://api.beatleader.com/players?sortBy=pp&page=1&count=10&order=desc&mapsType=ranked&friends=false",
    {
      method: "GET",
    },
  );

  if (!playersBL.ok) {
    throw new Error(`BeatLeader returned ${playersBL.status}`);
  }

  const playersBLArray = await playersBL.json();

  const playersBLData: IPlayerBL[] = (playersBLArray.data ?? []).slice(0, 10);

  return playersBLData.map((player: IPlayerBL) => {
    return {
      rank: player.rank,
      avatar: player.avatar,
      name: player.name,
      pp: player.pp,
      change: player.lastWeekRank - player.rank,
    };
  });
}

async function fetchAccSaberPlayers(): Promise<IPlayer[]> {
  const playersAS = await fetch(
    "https://api.accsaber.com/v1/leaderboards/overall",
    {
      method: "GET",
    },
  );

  if (!playersAS.ok) {
    throw new Error(`AccSaber returned ${playersAS.status}`);
  }

  const playersASResponse = (await playersAS.json()) as
    | IPlayerAS[]
    | { content?: IPlayerAS[] };

  const playersASData: IPlayerAS[] = (
    Array.isArray(playersASResponse)
      ? playersASResponse
      : (playersASResponse.content ?? [])
  ).slice(0, 10);

  return playersASData.map((player: IPlayerAS) => {
    return {
      rank: player.ranking,
      avatar: player.avatarUrl,
      name: player.userName,
      pp: player.averageAp,
      change: player.rankingLastWeek - player.ranking,
    };
  });
}

async function getLeaderboard(
  label: string,
  fetchPlayers: () => Promise<IPlayer[]>,
): Promise<LeaderboardResult> {
  try {
    return {
      players: await fetchPlayers(),
      error: null,
    };
  } catch (error) {
    console.error(`${label} leaderboard failed:`, error);

    return {
      players: [],
      error: `${label} failed to load.`,
    };
  }
}

export class TopPlayers {
  @GET("api/players/top", apicache.middleware("10 hours"))
  async get(req: Request, res: Response) {
    const [scoresaber, beatleader, accsaber] = await Promise.all([
      getLeaderboard("ScoreSaber", fetchScoreSaberPlayers),
      getLeaderboard("BeatLeader", fetchBeatLeaderPlayers),
      getLeaderboard("AccSaber", fetchAccSaberPlayers),
    ]);

    const hasErrors = Boolean(
      scoresaber.error || beatleader.error || accsaber.error,
    );

    res.status(hasErrors ? 206 : 200).json({
      scoresaber: scoresaber.players,
      beatleader: beatleader.players,
      accsaber: accsaber.players,

      errors: {
        scoresaber: scoresaber.error,
        beatleader: beatleader.error,
        accsaber: accsaber.error,
      },
    });
  }
}
