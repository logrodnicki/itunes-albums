import AlbumsList from './components/AlbumsList/AlbumsList';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <div>
        <AlbumsList />
      </div>
    </RecoilRoot>
  );
}

export default App;
