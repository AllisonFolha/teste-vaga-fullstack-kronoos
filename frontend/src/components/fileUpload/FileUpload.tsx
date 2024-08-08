import React, { useState } from 'react';
import Button from '../button/Button';
import Notification from '../notification/Notification';
import './FileUpload.scss';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      onFileUpload(file);
      setNotification(null);
    } else {
      setNotification({ message: 'Por favor, envie um arquivo', type: 'error' });
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button type="submit" onClick={handleSubmit} label="Upload" />
      </form>
      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
};

export default FileUpload;
