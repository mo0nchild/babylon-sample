import { useScene } from "@contexts/SceneContext";

type FileLoadedCallback = (base64: string) => void

interface FileInputProps {
  fileLoaded?: FileLoadedCallback
}

const FileInput: React.FC<FileInputProps> = ({ fileLoaded }) => {
  const { dispatch } = useScene()

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Поддерживаются только .glb файлы');
      return;
    }

    // dispatch({ type: 'LOADING' });
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let binary = '';

    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    fileLoaded?.(btoa(binary))
  };

  return (
    <input type="file" accept=".glb" onChange={handleFile} style={fileInputStyles} />
  )
}
export default FileInput

const fileInputStyles: React.CSSProperties = {
  position: 'absolute',
  top: 10,
  left: 10,
  zIndex: 1000,
  padding: '6px 10px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: 4,
  cursor: 'pointer',
}