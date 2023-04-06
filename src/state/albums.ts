import { atom, selector } from 'recoil';
import { Album, AlbumsFilters } from '@/types';

export const ALBUMS_KEY = 'albums';
export const ALBUMS_FILTERS_KEY = 'albums-filters';
export const FILTERED_ALBUMS_KEY = 'filtered-albums';

export const albumsState = atom<Album[]>({
  key: ALBUMS_KEY,
  default: []
});

export const albumsFiltersState = atom<AlbumsFilters>({
  key: ALBUMS_FILTERS_KEY,
  default: {
    searchText: '',
    categories: []
  }
});

export const filteredAlbumsState = selector({
  key: FILTERED_ALBUMS_KEY,
  get: ({ get }) => {
    const albums = get(albumsState);
    const filters = get(albumsFiltersState);

    if (!filters.searchText && filters.categories?.length === 0) {
      return albums;
    }

    return albums
      .filter((album) => {
        if (filters.categories?.length === 0) {
          return true;
        }

        return filters.categories?.includes(album.category.attributes.term);
      })
      .filter((album) => {
        if (!filters.searchText) {
          return true;
        }

        return album.title.label
          .toLowerCase()
          .includes(filters.searchText?.toLowerCase() as string);
      });
  }
});
