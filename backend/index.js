// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/warehouse', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Schema and Model
const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  warehouse: String,
});

const Item = mongoose.model('Item', ItemSchema);

// Route to handle importing goods
app.post('/api/import', async (req, res) => {
  const { name, quantity, price, warehouse, customer } = req.body;

  try {
    // Create a new item
    const newItem = new Item({ name, quantity, price, warehouse });
    await newItem.save();

    // Generate PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'import_invoice.pdf');
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(25).text('Import Invoice', { align: 'center' });
    doc.fontSize(15).text(`Name: ${name}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Price: $${price}`);
    doc.text(`Warehouse: ${warehouse}`);
    doc.text(`Customer: ${customer}`);
    doc.end();

    // Send response with PDF file URL
    res.status(201).json({ message: 'Import successful. Invoice generated.', file: '/api/download/import_invoice.pdf' });
  } catch (error) {
    console.error('Error importing goods:', error);
    res.status(500).json({ message: 'Error importing goods.' });
  }
});

// Route to handle exporting goods
app.post('/api/export', async (req, res) => {
  const { name, quantity, customer } = req.body;

  try {
    // Find item and update quantity
    const item = await Item.findOne({ name });
    if (!item || item.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock.' });
    }
    item.quantity -= quantity;
    await item.save();

    // Generate PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'export_invoice.pdf');
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(25).text('Export Invoice', { align: 'center' });
    doc.fontSize(15).text(`Name: ${name}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Customer: ${customer}`);
    doc.text(`Remaining Quantity: ${item.quantity}`);
    doc.end();

    // Send response with PDF file URL
    res.status(200).json({ message: 'Export successful. Invoice generated.', file: '/api/download/export_invoice.pdf' });
  } catch (error) {
    console.error('Error exporting goods:', error);
    res.status(500).json({ message: 'Error exporting goods.' });
  }
});

// Route to download PDF
app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ message: 'Error downloading file.' });
    }
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
