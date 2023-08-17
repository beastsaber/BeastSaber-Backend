import { GET } from "../../router";
import { Request, Response } from "express";
import { IMap } from "../../types/maps/maps";
import { ISearch } from "../../types/responses/search";
import apicache from "apicache";
import { IDiff } from "../../types/responses/maps";

export class Search {
    @GET('api/search', apicache.middleware('10 hours'))
    async get(req: Request, res: Response) {
        const { strict, query, page } = req.query;

        const data = await fetch(`https://api.beatsaver.com/search/text/${page}?q=${query}&sortOrder=Latest`, {
            method: 'GET'
        });

        if (data.status !== 200) {
            return res.status(data.status).json({
                error: true,
                message: 'An error occured while fetching the search results.'
            });
        }

        const dataArray = await data.json();

        const maps: IMap[] = dataArray.docs;

        const mapSearch: ISearch[] = [];

        maps.forEach(map => {
            if (strict == "true") {
                if (map.name.toLowerCase().includes(String(query).toLowerCase()) || map.description.toLowerCase().includes(String(query).toLowerCase())) {
                    const diffsArray: IDiff[] = [];

                    map.versions[0].diffs.forEach(diff => {
                        diffsArray.push({
                            characteristic: diff.characteristic,
                            difficulty: diff.difficulty,
                        })
                    });

                    mapSearch.push({
                        id: map.id,
                        name: map.name,
                        description: map.description,
                        uploader: map.uploader.name,
                        difficulties: diffsArray,
                        upvotes: map.stats.upvotes,
                        downvotes: map.stats.downvotes,
                        fileDownload: map.versions[0].downloadURL,
                        coverURL: map.versions[0].coverURL,
                        previewURL: map.versions[0].previewURL,
                        tags: map.tags
                    });
                }
            }

            else {
                const diffsArray: IDiff[] = [];

                map.versions[0].diffs.forEach(diff => {
                    diffsArray.push({
                        characteristic: diff.characteristic,
                        difficulty: diff.difficulty,
                    })
                });

                mapSearch.push({
                    id: map.id,
                    name: map.name,
                    description: map.description,
                    uploader: map.uploader.name,
                    difficulties: diffsArray,
                    upvotes: map.stats.upvotes,
                    downvotes: map.stats.downvotes,
                    fileDownload: map.versions[0].downloadURL,
                    coverURL: map.versions[0].coverURL,
                    previewURL: map.versions[0].previewURL,
                    tags: map.tags
                });
            }
        })

        return res.status(200).send(mapSearch);
    }
}