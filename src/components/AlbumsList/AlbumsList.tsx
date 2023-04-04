import React, { ReactElement, useEffect, useRef } from 'react';
import { ALBUMS_URL } from '@/api';
import { Album as AlbumModel, Response } from '@/types';
import { useRecoilState } from 'recoil';
import { albumsState } from '@/state/albums';
import { loadingMapState } from '@/state/loadingMap';
import Album from '@/components/AlbumsList/Album/Album';

import styles from './AlbumList.module.scss';

const AlbumsList = (): ReactElement => {
  const [albums, setAlbums] = useRecoilState<AlbumModel[]>(albumsState);
  const [loadingMap, setLoadingMap] = useRecoilState(loadingMapState);

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

  return (
    <div>
      {loadingMap.albums ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className={`d-grid grid gap-3 ${styles['albums-grid']}`}>
          {albums.map((album) => (
            <Album key={album.id.attributes['im:id']} album={album} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsList;
