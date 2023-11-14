import { NewsMedium } from './news-medium';
import { NewsTag } from './news-tag';

export interface NewsEntryDataPayload {
    ID: number | undefined;
    NewsID: string;
    Provider: number;
    Sport: number;
    Pinned: boolean;
    Published: boolean;
    PublishedAt: string;
    SortID: string;
    SeoURL: string;
    ExternalLink: string;
    Order: number;
    FeedID: number;
    AuthorID: number;
    Title: string;
    Description: string;
    Article: string;
    Author: string;
    Images: Array<NewsMedium>;
    Audios: Array<NewsMedium>;
    Videos: Array<NewsMedium>;
    StageTags: any | null;
    ParticipantTags: any | null;
    Language: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface FlowEntryDataPayload {
    author: FlowEntryAuthor;
    date: string;
    externalId:string;
    flowType:number;
    gender: number;
    ID:number;
    kudos:any;
    language:string;
    media:Array<FlowEntryMedia>
    participantId:string;
    service:string;
    sortId:string;
    source:string;
    sport: number;
    text:string;
    title:string;
    type:string;
    url:string;
}
export interface FlowEntryAuthor {
    name: string,
    username: string,
    userid: string,
    url: string
}
export interface FlowEntryMedia{
    height:number
    type:string
    url:string
    width : number
}
