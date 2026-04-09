import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDataForm = ({ onAddData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    serialNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.date || !formData.serialNo) {
      setError('All fields are required');
      toast.error('All fields are required');
      setLoading(false);
      return;
    }

    if (isNaN(parseFloat(formData.price))) {
      setError('Price must be a number');
      toast.error('Price must be a number');
      setLoading(false);
      return;
    }

    try {
      const newData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        date: formData.date,
        serialNo: formData.serialNo, // Use user-entered serial number
        createdAt: new Date().toISOString()
      };

      const success = await onAddData(newData);
      
      if (success) {
        // Reset form
        setFormData({
          name: '',
          category: '',
          price: '',
          date: new Date().toISOString().split('T')[0],
          serialNo: ''
        });
      } else {
        setError('Failed to add data');
        toast.error('Failed to add data');
      }
    } catch {
      setError('An error occurred while adding data');
      toast.error('An error occurred while adding data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-lg">
      <div className="card shadow-sm my-5">
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">Add New Record</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label" title="Enter serial number">
                  S.NO *
                </label>
                <input
                  type="text"
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter serial number"
                  required
                />
              </div>
              <div className="col-md-8">
                <label className="form-label" title="Enter record name">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter name"
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label" title="Select a category">
                  Category *
                </label>
                <select name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select category...</option>
                  <option value="Food">Food</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Cosmetics">Cosmetics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Books">Books</option>
                  <option value="Toys">Toys</option>
                  <option value="Sports">Sports</option>
                  <option value="Health">Health</option>
                  <option value="Daily Life Products">Daily Life Products</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="col-md-4">
                <label className="form-label" title="Enter a numerical price">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter price"
                  required
                />
              </div>
              
              <div className="col-md-4">
                <label className="form-label" title="Select the date for this record">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success w-100"
            >
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDataForm;
