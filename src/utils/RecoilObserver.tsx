import { RecoilValueReadOnly, useRecoilValue } from 'recoil';
import { FC, useEffect } from 'react';

interface Props {
  onChange: (value: string | number) => void;
  node: RecoilValueReadOnly<any>;
}

export const RecoilObserver: FC<Props> = ({ node, onChange }) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};
