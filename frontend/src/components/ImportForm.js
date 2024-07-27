// frontend/src/components/ImportForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/importForm.css';

const ImportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    warehouse: '',
    customer: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/import', formData);
      const { file } = response.data;
      // Trigger download of the generated PDF
      window.location.href = `http://localhost:5000${file}`;
    } catch (error) {
      console.error('Error importing goods:', error);
    }
  };

  return (
    <div className="importForm-container">
      <h1>Import Goods</h1>
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
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="warehouse"
          value={formData.warehouse}
          onChange={handleChange}
          placeholder="Warehouse"
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
        <button type="submit">Import Goods</button>
      </form>
    </div>
  );
};

export default ImportForm;
