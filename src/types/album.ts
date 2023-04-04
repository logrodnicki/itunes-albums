export interface Album {
  id: {
    attributes: {
      'im:id': string;
    };
  };
  title: {
    label: string;
  };
  'im:artist': {
    attributes: {
      href: string;
    };
    label: string;
  };
  'im:image': AlbumImage[];
  'im:name': {
    label: string;
  };
  'im:price': {
    label: string;
    attributes: {
      amount: string;
      currency: string;
    };
  };
  'im:releaseDate': {
    label: string;
    attributes: {
      label: string;
    };
  };
  rights: {
    label: string;
  };
  category: {
    attributes: {
      'im:id': string;
      label: string;
      scheme: string;
      theme: string;
    };
  };
  'im:itemCount': {
    label: string;
  };
}

export interface AlbumImage {
  label: string;
  attributes: {
    height: AlbumImageHeight;
  };
}

export type AlbumImageHeight = '55' | '60' | '170';
