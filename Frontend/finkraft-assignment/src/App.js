
import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filesList, setFilesList] = useState([]);
  const [inputKey, setInputKey] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState('');

  useEffect(() => {
    fetchFilesList();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fetchFilesList = () => {
    axios.get('http://localhost:3000/files')
      .then((response) => {
        setFilesList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching files:', error);
      });
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post('http://localhost:3000/upload', formData)
      .then(() => {
        fetchFilesList();
        setSelectedFile(null);
        setInputKey(Date.now());
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  const handleFileDelete = (filename) => {
    axios.delete(`http://localhost:3000/files/${filename}`)
      .then(() => {
        fetchFilesList();
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
  };

  const handleFileSelect = (filename) => {
    setSelectedFileName(filename);
  };

  const handleFileUpdate = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.put(`http://localhost:3000/files/${selectedFileName}`, formData)
      .then(() => {
        fetchFilesList();
        setSelectedFile(null);
        setSelectedFileName('');
        setInputKey(Date.now());
      })
      .catch((error) => {
        console.error('Error updating file:', error);
      });
  };

  return (
    <div className='center'>
      <h1>Finkraft File Upload App</h1>
      <input
        key={inputKey}
        type="file"
        onChange={handleFileChange}
      />
      <button onClick={handleFileUpload}>Upload</button>

      <ul>
        {filesList.map((file) => (
          <li key={file}>
            {file}
            <button onClick={() => handleFileDelete(file)}>Delete</button>
            <button onClick={() => handleFileSelect(file)}>Update</button>
          </li>
        ))}
      </ul>

      {selectedFileName && (
        <div>
          <input
            type="file"
            onChange={handleFileChange}
          />
          <button onClick={handleFileUpdate}>Update File</button>
        </div>
      )}
    </div>
  );
};

export default FileManagement;

