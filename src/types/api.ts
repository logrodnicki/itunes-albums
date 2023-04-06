import { Album } from './album';

export interface Response {
  feed: Feed;
}

export interface Feed {
  entry: Album[];
}
