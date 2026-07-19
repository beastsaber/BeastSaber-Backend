interface IScoreStats {
  totalScore: number;
  totalRankedScore: number;
  averageRankedAccuracy: number;
  totalPlayCount: number;
  rankedPlayCount: number;
  replaysWatched: number;
}

export interface IPlayerSS {
  id: string;
  name: string;
  profilePicture: string;
  bio: string;
  country: string;
  pp: number;
  rank: number;
  countryRank: number;
  role: string;
  badges: string[];
  histories: string;
  permissions: number;
  banned: boolean;
  inactive: boolean;
  scoreStats: IScoreStats;
}

export interface IPlayerBL {
  accPp: number;
  passPp: number;
  techPp: number;
  scoreStats: null;
  lastWeekPp: number;
  lastWeekRank: number;
  lastWeekCountryRank: number;
  eventsParticipating: null;
  id: string;
  name: string;
  platform: string;
  avatar: string;
  country: string;
  bot: boolean;
  pp: number;
  rank: number;
  countryRank: number;
  role: string;
  socials: null;
  patreonFeatures: null;
  profileSettings: null;
  clans: null;
}

export interface IPlayerAS {
  ranking: number;
  countryRanking: number;
  userId: string;
  userName: string;
  country: string;
  avatarUrl: string;
  cdnAvatarUrl: string;
  ap: number;
  averageAcc: number;
  averageAp: number;
  rankedPlays: number;
  topPlayId: string;
  playerInactive: boolean;
  rankingLastWeek: number;
}
