import BabylonScene from '@components/BabylonScene';

import './App.css';

import FileInput from '@components/FileInput';
import { useEffect, useState } from 'react';
import NodeTree from '@components/NodeTree';
import { useScene } from '@contexts/SceneContext';

function App(): React.JSX.Element {
  
  const { state: { currentState } } = useScene();
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  
  const handleFileLoaded = async (base64: string) => {
    setFileBase64(base64);
  };
  
  useEffect(() => {
    console.log(currentState)
  }, [ currentState ])
  
  return (
    <div className="App">
      <FileInput fileLoaded={handleFileLoaded} />
      
      {currentState === 'loading' && (
        <div style={{ padding: '20px', fontSize: '18px' }}>
          Загрузка модели...
        </div>
      )}
      
        <NodeTree /> 
        <BabylonScene fileBase64={fileBase64} />
      
    </div>
  );
}

export default App;
