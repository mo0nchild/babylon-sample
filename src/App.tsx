import BabylonScene from '@components/BabylonScene';
import { SceneProvider } from '@contexts/SceneContext';

import './App.css';

function App() {
  return (
    <div className="App">
      <SceneProvider>
        <BabylonScene />
      </SceneProvider>
    </div>
  );
}

export default App;
