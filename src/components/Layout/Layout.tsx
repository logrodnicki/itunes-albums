import React, { FC, ReactElement, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }): ReactElement => {
  return <div className="container-md d-flex justify-content-center py-4">{children}</div>;
};

export default Layout;
