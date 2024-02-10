interface IUploader {
    id: number;
    name: string;
    avatar: string;
    type: string;
    admin: boolean;
    curator: boolean;
    verifiedMapper: boolean;
    playlistUrl: string;
}

interface IMetadata {
    bpm: number;
    duration: number;
    songName: string;
    songSubName: string;
    songAuthorName: string;
    levelAuthorName: string;
}

interface IStats {
    plays: number;
    downloads: number;
    upvotes: number;
    downvotes: number;
    score: number;
}

interface IParitySummary {
    errors: number;
    warns: number;
    resets: number;
}

interface IDiff {
    njs: number;
    offset: number;
    notes: number;
    bombs: number;
    obstacles: number;
    nps: number;
    length: number;
    characteristic: string;
    difficulty: string;
    events: number;
    chroma: boolean;
    me: boolean;
    ne: boolean;
    cinema: boolean;
    seconds: number;
    paritySummary: IParitySummary;
    stars?: number;
    maxScore: number;
    label?: string;
}

interface IVersion {
    hash: string;
    state: string;
    createdAt: Date;
    sageScore: number;
    diffs: IDiff[];
    downloadURL: string;
    coverURL: string;
    previewURL: string;
}

interface ICurator {
    id: number;
    name: string;
    hash: string;
    avatar: string;
    type: string;
    admin: boolean;
    curator: boolean;
    verifiedMapper: boolean;
    playlistUrl: string;
}

export interface IMap {
    id: string;
    name: string;
    description: string;
    uploader: IUploader;
    metadata: IMetadata;
    stats: IStats;
    uploaded: Date;
    automapper: boolean;
    ranked: boolean;
    qualified: boolean;
    versions: IVersion[];
    curator: ICurator;
    curatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    lastPublishedAt: Date;
    tags: string[];
    bookmarked: boolean;
}

interface IBlModifierValues {
    modifierId: number;
    da: number;
    fs: number;
    sf: number;
    ss: number;
    gn: number;
    na: number;
    nb: number;
    nf: number;
    no: number;
    pm: number;
    sc: number;
    sa: number;
    op: number;
}

interface IBLDifficulties {
    id: number;
    value: number;
    mode: number;
    difficultyName: string;
    modeName: string;
    status: number;
    modifierValues: IBlModifierValues;
    modifierRating: number;
    nominatedTime: Date;
    rankedTime: Date;
    stars: number;
    predictedAcc: number;
    passRating: number;
    accRating: number;
    techRating: number;
    type: number;
    njs: number;
    nps: number;
    notes: number;
    bombs: number;
    walls: number;
    maxScore: number;
    duration: number;
    requirements: number;
}

interface IBLSong {
    id: string;
    hash: string;
    name: string;
    subName: string;
    author: string;
    mapper: string;
    mapperId: number;
    coverImage: string;
    fullCoverImage: string;
    downloadUrl: string;
    bpm: number;
    duration: number;
    tags: string;
    uploadTime: Date;
    difficulties: IBLDifficulties[];
}

interface IBLDifficulty {
    id: number;
    value: number;
    mode: number;
    difficultyName: string;
    modeName: string;
    status: number;
    modifierValues: IBlModifierValues;
    modifierRating: number;
    nominatedTime: Date;
    qualifiedTime: Date;
    rankedTime: Date;
    stars: number;
    predictedAcc: number;
    passRating: number;
    accRating: number;
    techRating: number;
    type: number;
    njs: number;
    nps: number;
    notes: number;
    bombs: number;
    walls: number;
    maxScore: number;
    duration: number;
    requirements: number;
}

export interface IBLMap {
    id: string;
    song: IBLSong;
    difficulty: IBLDifficulty;
    plays: number;
    positiveVotes: number;
    starVotes: number;
    negativeVotes: number;
    voteStars: number;
    myScore: number;
    qualification: string;
    reweight: number;
}