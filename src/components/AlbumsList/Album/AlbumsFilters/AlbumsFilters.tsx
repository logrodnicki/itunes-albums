import React, { ChangeEvent, ReactElement, useCallback, useMemo, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import classNames from 'classnames';
import { debounce as _debounce } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { albumsFiltersState, albumsState } from '@/state/albums';

import styles from './AlbumsFilters.module.scss';

const AlbumsFilters = (): ReactElement => {
  const [albumsFilters, setAlbumsFilters] = useRecoilState(albumsFiltersState);
  const albums = useRecoilValue(albumsState);

  const [displayedSearchText, setDisplayedSearchText] = useState('');
  const [areCategoriesVisible, setAreCategoriesVisible] = useState(false);

  const categories = useMemo(() => {
    const mappedCategories = albums.reduce<Record<string, string>>((acc, currentValue) => {
      acc[currentValue.category.attributes.term] = currentValue.category.attributes.label;
      return acc;
    }, {});

    return Object.entries(mappedCategories);
  }, [albums]);

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
    <div className="row d-flex flex-column gap-4">
      <div className="col-12 mx-auto">
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
      <div className="col-12">
        <div className="row">
          <div className="col-md-2 d-flex align-items-center">
            <span className="fw-bold">Categories</span>
            {albumsFilters?.categories?.length ? (
              <span className="badge text-bg-primary mx-2">{albumsFilters.categories?.length}</span>
            ) : null}
          </div>
          <div className="col-1 d-flex justify-content-end">
            <button
              className={classNames('btn btn-light')}
              onClick={toggleCategoriesHandler}
              title={areCategoriesVisible ? 'Hide' : 'Show'}
              aria-label="Toggle categories filters"
            >
              <span
                className={classNames(styles['toggle-button'], {
                  [styles.rotate]: areCategoriesVisible
                })}
              >
                <i className="bi bi-chevron-down"></i>
              </span>
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
                  aria-label="Category button"
                >
                  {label}
                </button>
              ))}
            </div>
          </AnimateHeight>
        </div>
      </div>
    </div>
  );
};

export default AlbumsFilters;
