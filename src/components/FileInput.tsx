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

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      fileLoaded?.(result);
    };
    reader.onerror = () => {
      alert('Ошибка чтения файла');
      dispatch({ type: 'CLEAR' });
    };
    reader.readAsDataURL(file)
  };

  return (
    <input type="file" accept=".glb" onChange={handleFile} style={fileInputStyles} />
  )
}
export default FileInput

const fileInputStyles: React.CSSProperties = {
  padding: '6px 10px',
  backgroundColor: '#2e2c2cff',
  border: '1px solid #ccc',
  borderRadius: 4,
  cursor: 'pointer',
}