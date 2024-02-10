export interface IDiff {
    characteristic: string;
    difficulty: string;
}

export interface ICuratedMaps {
    id: string;
    name: string;
    description: string;
    uploader: string;
    difficulties: IDiff[];
    upvotes: number;
    downvotes: number;
    fileDownload: string;
    coverURL: string;
    previewURL: string;
    tags: string[];
}

export interface IDiffRanked {
    characteristic: string;
    difficulty: string;
    stars: number;
}

export interface IRankedMaps {
    id: string;
    name: string;
    uploader: string;
    difficulties: IDiffRanked[];
    upvotes: number;
    downvotes: number;
    fileDownload: string;
    coverURL: string;
    previewURL: string;
    tags: string[];
}