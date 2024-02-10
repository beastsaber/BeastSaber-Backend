interface IOwner {
    id: number;
    name: string;
    avatar: string;
    type: string;
    admin: boolean;
    curator: boolean;
    verifiedMapper?: boolean;
    playlistUrl: string;
}

interface ICurator {
    id: number;
    name: string;
    avatar: string;
    type: string;
    admin: boolean;
    curator: boolean;
    verifiedMapper?: boolean;
    playlistUrl: string;
}

interface IStats {
    totalMaps: number;
    mapperCount: number;
    totalDuration: number;
    minNps: number;
    maxNps: number;
    upVotes: number;
    downVotes: number;
    avgScore: number;
}

export interface IPlaylist {
    playlistId: number;
    name: string;
    description: string;
    playlistImage: string;
    playlistImage512: string;
    owner: IOwner;
    curator: ICurator;
    stats: IStats;
    createdAt: Date;
    updatedAt: Date;
    songsChangedAt: Date;
    curatedAt: Date;
    downloadURL: string;
    type: string;
}