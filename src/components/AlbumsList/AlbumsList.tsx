import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { ALBUMS_URL } from '@/api';
import { Album as AlbumModel, Response } from '@/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { albumsFiltersState, albumsState, filteredAlbumsState } from '@/state/albums';
import { loadingMapState } from '@/state/loadingMap';
import Album from '@/components/AlbumsList/Album/Album';
import { debounce as _debounce } from 'lodash';
import AlbumPlaceholder from '@/components/AlbumsList/Album/AlbumPlaceholder/AlbumPlaceholder';

import styles from './AlbumList.module.scss';
import classNames from 'classnames';
import AnimateHeight from 'react-animate-height';

const PLACEHOLDER_AMOUNT = 12;

const AlbumsList = (): ReactElement => {
  const [albums, setAlbums] = useRecoilState<AlbumModel[]>(albumsState);
  const [loadingMap, setLoadingMap] = useRecoilState(loadingMapState);
  const [albumsFilters, setAlbumsFilters] = useRecoilState(albumsFiltersState);
  const filteredAlbums = useRecoilValue(filteredAlbumsState);
  const [displayedSearchText, setDisplayedSearchText] = useState('');
  const [areCategoriesVisible, setAreCategoriesVisible] = useState(false);

  const currentAbortController = useRef<AbortController | null>(null);

  const categories = useMemo(() => {
    const mappedCategories = albums.reduce<Record<string, string>>((acc, currentValue) => {
      acc[currentValue.category.attributes.term] = currentValue.category.attributes.label;
      return acc;
    }, {});

    return Object.entries(mappedCategories);
  }, [albums]);

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

  const clickCategoryHandler = (value: string): void => {
    if (albumsFilters.categories?.includes(value)) {
      setAlbumsFilters((oldFilters) => ({
        ...oldFilters,
        categories: albumsFilters.categories?.filter((category) => category !== value)
      }));
      return;
    }

    setAlbumsFilters((oldFilters) => ({
      ...oldFilters,
      categories: [...(albumsFilters?.categories as string[]), value]
    }));
  };

  const clearSearchTextHandler = (): void =>
    setAlbumsFilters((oldValue) => ({ ...oldValue, searchText: '' }));

  const toggleCategoriesHandler = (): void => setAreCategoriesVisible(!areCategoriesVisible);

  return (
    <div className="row d-flex flex-column gap-4 w-100">
      <div className="col mx-auto">
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
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={clearSearchTextHandler}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div className="col">
        <div className="row">
          <div className="col-md-2 d-flex align-items-center">
            <span className="fw-bold">Categories</span>
            {albumsFilters?.categories?.length ? (
              <span className="badge text-bg-primary mx-2">{albumsFilters.categories?.length}</span>
            ) : null}
          </div>
          <div className="col-1 d-flex justify-content-end">
            <button className="btn btn-light" onClick={toggleCategoriesHandler}>
              <i className="bi bi-chevron-down"></i>
            </button>
          </div>
          <AnimateHeight height={areCategoriesVisible ? 'auto' : 0} duration={300}>
            <div className="col d-flex gap-2 flex-wrap mt-4">
              {categories.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={classNames(
                    'btn',
                    albumsFilters.categories?.includes(value) ? 'btn-dark' : 'btn-light'
                  )}
                  onClick={(): void => clickCategoryHandler(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </AnimateHeight>
        </div>
      </div>
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
