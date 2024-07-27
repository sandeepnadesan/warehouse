// frontend/src/components/ExportForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/exportForm.css';

const ExportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    customer: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/export', formData);
      const { file } = response.data;
      // Trigger download of the generated PDF
      window.location.href = `http://localhost:5000${file}`;
    } catch (error) {
      console.error('Error exporting goods:', error);
    }
  };

  return (
    <div className="exportForm-container">
      <h1>Export Goods</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <input
          type="text"
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          placeholder="Customer Name"
          required
        />
        <button type="submit">Export Goods</button>
      </form>
    </div>
  );
};

export default ExportForm;
