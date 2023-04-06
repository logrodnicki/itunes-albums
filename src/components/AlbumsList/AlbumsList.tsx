import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import { ALBUMS_URL } from '@/api';
import { Response } from '@/types';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { albumsState, filteredAlbumsState } from '@/state/albums';
import { loadingMapState } from '@/state/loadingMap';
import Album from '@/components/AlbumsList/Album/Album';
import AlbumPlaceholder from '@/components/AlbumsList/Album/AlbumPlaceholder/AlbumPlaceholder';

import styles from './AlbumsList.module.scss';
import AlbumsFilters from '@/components/AlbumsList/Album/AlbumsFilters/AlbumsFilters';

const PLACEHOLDER_AMOUNT = 12;

const AlbumsList = (): ReactElement => {
  const setAlbums = useSetRecoilState(albumsState);
  const [loadingMap, setLoadingMap] = useRecoilState(loadingMapState);
  const filteredAlbums = useRecoilValue(filteredAlbumsState);

  const currentAbortController = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const placeholderArray = useMemo(() => {
    const array: number[] = [];

    for (let i = 0; i < PLACEHOLDER_AMOUNT; i++) {
      array.push(i);
    }

    return array;
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

  return (
    <div className="row d-flex flex-column gap-4 w-100">
      <h1>Top iTunes albums</h1>
      <AlbumsFilters />
      <div className={`d-grid grid justify-content-center gap-3 col ${styles['albums-grid']}`}>
        {loadingMap.albums ? (
          <>
            {placeholderArray.map((value) => (
              <AlbumPlaceholder key={value} />
            ))}
          </>
        ) : (
          <>
            {filteredAlbums.map((album) => (
              <Album key={album.id.attributes['im:id']} album={album} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AlbumsList;
