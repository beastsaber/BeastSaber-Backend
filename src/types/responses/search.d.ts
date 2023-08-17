import { IDiff } from "./maps";

export interface ISearch {
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