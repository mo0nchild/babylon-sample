type FileLoadedCallback = (file: File) => void

interface FileInputProps {
  fileLoaded: FileLoadedCallback
}

const FileInput: React.FC<FileInputProps> = ({ fileLoaded }) => {
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Поддерживаются только .glb файлы');
      return;
    }
    fileLoaded(file)
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