import AlbumsList from './components/AlbumsList/AlbumsList';
import { RecoilRoot } from 'recoil';
import Layout from '@/components/Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <RecoilRoot>
      <Layout>
        <AlbumsList />
      </Layout>
    </RecoilRoot>
  );
}

export default App;
