import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';

import styles from './AlbumImage.module.scss';
import classNames from 'classnames';

interface Props {
  src: string;
  alt: string;
}

const AlbumImage: FC<Props> = ({ src, alt }): ReactElement => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const circleRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!circleRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (isLoaded || entry.intersectionRatio < 0.8) {
            return;
          }

          setImageSrc(src);
        });
      },
      { threshold: 0.8 }
    );

    observerRef.current = observer;

    observer.observe(circleRef.current);

    return (): void => {
      observer.disconnect();
    };
  }, []);

  const loadedHandler = (): void => {
    observerRef.current?.disconnect?.();
    setIsLoaded(true);
  };

  return (
    <>
      <div className={classNames('rounded-circle bg-light', styles.circle)} ref={circleRef} />
      <img
        className={classNames(
          'img-fluid card-img-top ratio-1x1 rounded-circle',
          isLoaded ? 'd-block' : 'd-none',
          { [styles['visible-image']]: isLoaded }
        )}
        src={imageSrc}
        alt={alt}
        onLoad={loadedHandler}
      />
    </>
  );
};

export default AlbumImage;
