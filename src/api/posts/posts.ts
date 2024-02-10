import { GET } from "../../router";
import { Request, Response } from "express";
import apicache from "apicache";
import fs from "fs";

export class Posts {
    @GET('api/posts/latest', apicache.middleware('1 hour'))
    getPosts(req: Request, res: Response) {
        const postsArray: string[] = [];
        fs.readdirSync('./posts').map((post: string) => {
            postsArray.push(post);
        });

        postsArray.sort((a: string, b: string) => {
            const file = fs.readFileSync(`./posts/${a}`, 'utf-8').toString();
            const file2 = fs.readFileSync(`./posts/${b}`, 'utf-8').toString();

            const date = file.split('\n')[0];
            const date2 = file2.split('\n')[0];

            if (date > date2) {
                return -1;
            }

            if (date < date2) {
                return 1;
            }
        });



        postsArray.length = 4;

        const postsMap = postsArray.map((post: string) => {
            const postFile = fs.readFileSync(`./posts/${post}`, 'utf-8');
            
            return {
                date: postFile.split('\n')[0],
                time: postFile.split('\n')[1],
                title: postFile.split('\n')[2],
                content: postFile.split('\n').slice(4).join('\n').substring(0, 200) + '...'
            }
        });

        return res.status(200).send(postsMap);
    }

    @GET('api/post/:post', apicache.middleware('1 hour'))
    getPost(req: Request, res: Response) {
        const post = req.params.post;

        const postFile = fs.readFileSync(`./posts/${post}.md`, 'utf-8').toString();

        return res.status(200).send({
            date: postFile.split('\n')[0],
            time: postFile.split('\n')[1],
            title: postFile.split('\n')[2],
            content: postFile.split('\n').slice(4).join('\n')
        });
    }
}