import { CommentModel } from "./comment.model";

export interface BookModel {
    id: string;
    isbn: string;
    title: string;
    subtitle: string;
    author: string;
    published: string;
    publisher: string;
    pages: number;
    description: string;
    website: string;
    comments: CommentModel[];
}