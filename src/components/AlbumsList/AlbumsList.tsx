import React, { ReactElement, useEffect, useRef } from 'react';
import { ALBUMS_URL } from '@/api';
import { Album, Response } from '@/types';
import { useRecoilState } from 'recoil';
import { albumsState } from '@/state/albums';
import { loadingMapState } from '@/state/loadingMap';

const AlbumsList = (): ReactElement => {
  const [albums, setAlbums] = useRecoilState<Album[]>(albumsState);
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
      <div>test {albums?.length}</div>
    </div>
  );
};

export default AlbumsList;
