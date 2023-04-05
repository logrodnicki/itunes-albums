import React, { ChangeEvent, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { ALBUMS_URL } from '@/api';
import { Album as AlbumModel, Response } from '@/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { albumsFiltersState, albumsState, filteredAlbumsState } from '@/state/albums';
import { loadingMapState } from '@/state/loadingMap';
import Album from '@/components/AlbumsList/Album/Album';
import { debounce as _debounce } from 'lodash';

import styles from './AlbumList.module.scss';

const AlbumsList = (): ReactElement => {
  const [albums, setAlbums] = useRecoilState<AlbumModel[]>(albumsState);
  const [loadingMap, setLoadingMap] = useRecoilState(loadingMapState);
  const [albumsFilters, setAlbumsFilters] = useRecoilState(albumsFiltersState);
  const filteredAlbums = useRecoilValue(filteredAlbumsState);
  const [displayedSearchText, setDisplayedSearchText] = useState('');

  const currentAbortController = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async (): Promise<void> => {
    currentAbortController.current?.abort?.();

    try {
      setLoadingMap((oldLoadingMap) => ({
        ...oldLoadingMap,
        albums: true
      }));

      const abortController = new AbortController();

      currentAbortController.current = abortController;

      const response = await fetch(ALBUMS_URL, { signal: abortController.signal });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as Response;

      setAlbums(data.feed.entry);
    } finally {
      setLoadingMap((oldLoadingMap) => ({
        ...oldLoadingMap,
        albums: false
      }));
    }
  };

  const debounceChangeSearchTextHandler = useCallback(
    _debounce((value: string) => {
      setAlbumsFilters({
        ...albumsFilters,
        searchText: value
      });
    }, 500),
    []
  );

  const changeSearchTextHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setDisplayedSearchText(value);
    debounceChangeSearchTextHandler(value);
  };

  return (
    <div className="row d-flex flex-column gap-4 w-100">
      <div className="col-lg-6 mx-auto">
        <div className="input-group">
          <span className="input-group-text" id="basic-addon">
            Search
          </span>
          <input
            type="text"
            className="form-control"
            value={displayedSearchText}
            onChange={changeSearchTextHandler}
            aria-label="Search text"
            aria-describedby="basic-addon"
          />
        </div>
      </div>
      {loadingMap.albums ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className={`d-grid grid gap-3 ${styles['albums-grid']}`}>
          {filteredAlbums.map((album) => (
            <Album key={album.id.attributes['im:id']} album={album} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsList;
