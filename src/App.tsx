import BabylonScene from '@components/BabylonScene';

import './App.css';

import FileInput from '@components/FileInput';
import { useEffect, useState } from 'react';
import NodeTree from '@components/NodeTree';
import { useScene } from '@contexts/SceneContext';

function App(): React.JSX.Element {
  
  const { state: { currentState } } = useScene();
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null)
  
  const handleFileLoaded = async (base64: string) => {
    setModelUrl(base64);
  };

  const clearScene = () => {
    setModelUrl(null)
  }
  
  useEffect(() => {
    console.log(currentState)
  }, [ currentState ])

  if (!modelUrl) {
    return <div style={{
      display: 'flex', 
      flexFlow: 'column nowrap',
      width: '100%',
      alignItems: 'center',
    }}>
      <h2>Загрузка модели</h2>
      <FileInput fileLoaded={handleFileLoaded} />
    </div>
  } 
  
  return (
    <div className="App">

      {currentState === 'loading' && (
        <div style={{ padding: '20px', fontSize: '18px' }}>
          Загрузка модели...
        </div>
      )}
      
      
      <div style={{display: 'flex', gap: '10px', margin: '0px 0px 0px 20px',}}>
        <button 
          style={{
            backgroundColor: '#ff4848ff',
          }} 
          onClick={clearScene}
        >
          Очистить
        </button>
        <div style={{border: '1px solid white', padding: '10px', borderRadius: '10px'}}>
          CTRL + ЛКМ 
        </div>
        <span style={{textAlign: 'center'}}>- для перемещения камеры</span>
        <div style={{border: '1px solid white', padding: '10px', borderRadius: '10px'}}>
          ЛКМ 
        </div>
        <span style={{textAlign: 'center'}}>- для вращения камеры</span>
      </div>
      <div style={modelControlStyle}>
        
        <NodeTree onSelect={ n => {
          setSelected(n)
          console.log(n)
        } }/> 
        <BabylonScene modelUrl={modelUrl} selectedNode={selected}/>
      </div>
      
        
    </div>
  );
}

export default App;

const modelControlStyle: React.CSSProperties = {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  gap: '50px',
  marginTop: '50px'
}