import { atom } from 'recoil';
import { LoadingMap } from '@/types';

export const LOADING_MAP_KEY = 'loadingMap';

export const loadingMapState = atom<LoadingMap>({
  key: LOADING_MAP_KEY,
  default: {
    albums: false
  }
});
