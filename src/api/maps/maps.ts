import { GET } from "../../router";
import { Request, Response } from "express";
import { IBLMap, IMap } from "../../types/maps/maps";
import { IDiff, ICuratedMaps, IDiffRanked, IRankedMaps } from "../../types/responses/maps";
import apicache from "apicache";

export class LatestCurated {
    @GET('api/maps/curated', apicache.middleware('1 hour'))
    async getCurated(req: Request, res: Response) {
        const curated = await fetch('https://api.beatsaver.com/maps/latest?sort=CURATED', {
            method: 'GET'
        });

        if (curated.status !== 200) {
            return res.status(curated.status).json({
                error: true,
                message: 'An error occured while fetching the latest curated maps.'
            });
        }

        const curatedArray = await curated.json();

        const curatedMaps: IMap[] = curatedArray.docs;
        curatedMaps.length = 10;

        const mapCurated: ICuratedMaps[] = curatedMaps.map((map: IMap) => {
            const diffsArray: IDiff[] = [];

            map.versions[0].diffs.forEach(diff => {
                    diffsArray.push({
                        characteristic: diff.characteristic,
                        difficulty: diff.difficulty,
                })
            });

            return {
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
            }
        });

        return res.status(200).send(mapCurated);
    }

    @GET('api/maps/ranked', apicache.middleware('10 hours'))
    async getRanked(req: Request, res: Response) {
        const rankedSS = await fetch('https://api.beatsaver.com/search/text/0?ranked=true&sortOrder=Latest', {
            method: 'GET'
        });

        if (rankedSS.status !== 200) {
            return res.status(rankedSS.status).json({
                error: true,
                message: 'An error occured while fetching the latest ranked maps.'
            });
        }

        const rankedSSArray = await rankedSS.json();

        const rankedMapsSS: IMap[] = rankedSSArray.docs;
        rankedMapsSS.length = 10;

        const mapRankedSS: IRankedMaps[] = rankedMapsSS.map((map: IMap) => {
            const diffsArray: IDiffRanked[] = [];

            map.versions[0].diffs.forEach(diff => {
                diffsArray.push({
                        characteristic: diff.characteristic,
                        difficulty: diff.difficulty,
                        stars: diff.stars
                })
            });

            return {
                id: map.id,
                name: map.name,
                uploader: map.uploader.name,
                difficulties: diffsArray,
                upvotes: map.stats.upvotes,
                downvotes: map.stats.downvotes,
                fileDownload: map.versions[0].downloadURL,
                coverURL: map.versions[0].coverURL,
                previewURL: map.versions[0].previewURL,
                tags: map.tags
            }
        });

        const alreadyDone: string[] = [];
        let iterations = 0;

        const rankedBL = await fetch('https://api.beatleader.xyz/leaderboards/groupped?page=1&count=20&sortBy=1&type=1&stars_from=0.01', {
            method: 'GET'
        });

        if (rankedBL.status !== 200) {
            return res.status(rankedBL.status).json({
                error: true,
                message: 'An error occured while fetching the latest ranked maps.'
            });
        }

        const rankedBLArray = await rankedBL.json();

        const rankedMapsBL: IBLMap[] = rankedBLArray.data;

        const mapRankedBL: IRankedMaps[] = [];

        for (const map of rankedMapsBL) {
            if (alreadyDone.includes(map.song.hash)) continue;
            alreadyDone.push(map.song.hash);
            iterations++;
            if (iterations >= 11) continue;
            await new Promise(resolve => setTimeout(resolve, 10));

            const diffsArray: IDiffRanked[] = [];

            map.song.difficulties.forEach(diff => {
                diffsArray.push({
                        characteristic: diff.modeName,
                        difficulty: diff.difficultyName,
                        stars: diff.stars
                })
            });

            const bsMap: IMap = await fetch(`https://api.beatsaver.com/maps/hash/${map.song.hash}`, {
                method: 'GET'
            }).then(res => res.json());

            mapRankedBL.push({
                id: bsMap.id,
                name: bsMap.name,
                uploader: bsMap.uploader.name,
                difficulties: diffsArray,
                upvotes: bsMap.stats.upvotes,
                downvotes: bsMap.stats.downvotes,
                fileDownload: bsMap.versions[0].downloadURL,
                coverURL: bsMap.versions[0].coverURL,
                previewURL: bsMap.versions[0].previewURL,
                tags: bsMap.tags
            });
        }

        return res.status(200).json({
            scoresaber: mapRankedSS,
            beatleader: mapRankedBL
        })
    }
}