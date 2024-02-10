import { GET } from "../../router";
import { Request, Response } from "express";
import apicache from "apicache";
import { IPlaylist } from "../../types/maps/playlists";
import { ILatestPlaylists } from "../../types/responses/playlists";

export class LatestPlaylists {
    @GET('api/playlists/latest', apicache.middleware('1 hour'))
    async get(req: Request, res: Response) {
        const playlists = await fetch('https://api.beatsaver.com/playlists/search/0?curated=true&sortOrder=Latest', {
            method: 'GET'
        });

        if (playlists.status !== 200) {
            return res.status(playlists.status).json({
                error: true,
                message: 'An error occured while fetching the latest curated playlists.'
            });
        }

        const playlistsArray = await playlists.json();
        
        const playlistLatest: IPlaylist[] = playlistsArray.docs;
        playlistLatest.length = 4;

        const playlistMap: ILatestPlaylists[] = playlistLatest.map((playlist: IPlaylist) => {
            return {
                id: playlist.playlistId,
                name: playlist.name,
                image: playlist.playlistImage,
            }
        });

        return res.status(200).send(playlistMap);
    }
}