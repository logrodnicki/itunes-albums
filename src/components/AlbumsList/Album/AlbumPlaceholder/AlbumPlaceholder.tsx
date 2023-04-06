import React, { ReactElement } from 'react';

import styles from './AlbumPlaceholder.module.scss';
import classNames from 'classnames';

const AlbumPlaceholder = (): ReactElement => {
  return (
    <div className="card rounded-4 shadow border-0 placeholder-glow" aria-hidden="true">
      <div
        className={classNames(
          'rounded-circle bg-secondary placeholder mx-auto mt-3',
          styles.circle
        )}
      />
      <div className="card-body">
        <span className="col-6 placeholder mb-1" />
        <span className="col-12 placeholder" />
        <span className="col-2 placeholder" />
      </div>
    </div>
  );
};

export default AlbumPlaceholder;
