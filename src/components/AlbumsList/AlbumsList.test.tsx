import { describe, expect, it } from 'vitest';
import Layout from '@/components/Layout/Layout';
import AlbumsList from '@/components/AlbumsList/AlbumsList';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';

describe('AlbumsList', () => {
  it('renders component without errors', async () => {
    const { container } = render(
      <RecoilRoot>
        <Layout>
          <AlbumsList />
        </Layout>
      </RecoilRoot>
    );
    expect(container).toBeInTheDocument();
  });
});
