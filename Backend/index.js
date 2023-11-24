const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require("cors");

const app = express();
const upload = multer({ dest: 'uploads/' }); // Destination for file uploads

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors());

// Endpoint to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
  // Access the uploaded file using req.file
  res.send('File uploaded successfully');
});

// Endpoint to get a list of files
app.get('/files', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading directory');
      return;
    }
    res.json(files);
  });
});

// Endpoint to read a specific file
app.get('/files/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(404).send('File not found');
        return;
      }
      res.send(data);
    });
  });
  
  // Endpoint to update a specific file
  app.put('/files/:filename', upload.single('file'), (req, res) => {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;
  
    fs.writeFile(filePath, req.file.buffer, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating file');
        return;
      }
      res.send('File updated successfully');
    });
  });
  
  // Endpoint to delete a specific file
  app.delete('/files/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;
  
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error deleting file');
        return;
      }
      res.send('File deleted successfully');
    });
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
