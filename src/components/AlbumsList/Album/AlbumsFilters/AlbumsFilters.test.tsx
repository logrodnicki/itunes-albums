import { describe, expect, it, vi } from 'vitest';
import Layout from '@/components/Layout/Layout';
import { RecoilRoot } from 'recoil';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { albumsFiltersState } from '@/state/albums';
import { RecoilObserver } from '@/utils/RecoilObserver';
import AlbumsFilters from '@/components/AlbumsList/Album/AlbumsFilters/AlbumsFilters';

describe('AlbumsFilters', () => {
  it('renders component without errors', async () => {
    const { container } = render(
      <RecoilRoot>
        <Layout>
          <AlbumsFilters />
        </Layout>
      </RecoilRoot>
    );
    expect(container).toBeInTheDocument();
  });

  it('changes search text when user enters a fraze', async () => {
    const onChange = vi.fn();

    const { getByRole } = render(
      <RecoilRoot>
        <Layout>
          <RecoilObserver node={albumsFiltersState} onChange={onChange} />
          <AlbumsFilters />
        </Layout>
      </RecoilRoot>
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Metallica' } });

    await expect(onChange).toHaveBeenCalledTimes(1);
    await expect(getByRole('textbox', { value: 'Metallica' })).toBeInTheDocument();
    await waitFor(
      () => expect(onChange).toHaveBeenCalledWith({ categories: [], searchText: 'Metallica' }),
      {
        timeout: 1000
      }
    );
  });
});
