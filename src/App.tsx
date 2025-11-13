import BabylonScene from '@components/BabylonScene';
import { SceneProvider } from '@contexts/SceneContext';

import './App.css';
import FileInput from '@components/FileInput';
import { useState } from 'react';
import NodeTree from '@components/NodeTree';

function App() {
  const [fileBase64, setFileBase64] = useState<string | null>(null);

  const handleFileLoaded = async (base64: string) => {
    

    setFileBase64(base64);
  };

  return (
    <div className="App">
      <SceneProvider>
        <FileInput fileLoaded={handleFileLoaded} />
        <BabylonScene fileBase64={fileBase64} />
        <NodeTree />
      </SceneProvider>
    </div>
  );
}

export default App;
