import { atom } from 'recoil';
import { Album } from '@/types';

export const ALBUMS_KEY = 'albums';

export const albumsState = atom<Album[]>({
  key: ALBUMS_KEY,
  default: []
});
