import React, { FC, ReactElement } from 'react';
import { Album as AlbumModel } from '@/types';
import classNames from 'classnames';

import styles from './Album.module.scss';
import AlbumImage from '@/components/AlbumsList/Album/AlbumImage/AlbumImage';

interface Props {
  album: AlbumModel;
}

const Album: FC<Props> = ({ album }): ReactElement => {
  const image = album['im:image'].find((img) => img.attributes.height === '170');

  return (
    <div className={classNames('card rounded-4 shadow border-0 hover-effect', styles.wrapper)}>
      <div
        className={classNames('ratio-1x1 d-flex justify-content-center mx-auto mt-3', styles.image)}
      >
        <AlbumImage src={image?.label as string} alt="Album image" />
      </div>
      <div className="card-body">
        <h6 className="col">{album['im:name'].label}</h6>
        <div className="col text-secondary">{album['im:artist'].label}</div>
        <div className="col ">{album['im:price'].label}</div>
      </div>
    </div>
  );
};

export default Album;
