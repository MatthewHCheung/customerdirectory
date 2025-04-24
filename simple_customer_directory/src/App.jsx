import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    phone: '',
    profile_picture_url: '',
    contract_start_date: '',
    contract_expire_date: '',
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetch('http://localhost:3000/customers')
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error('Failed to fetch customers:', err));
  }, []);


  // Validate form data
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email.';
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name required.';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Phone must be in XXX-XXX-XXXX format.';
    if (!dateRegex.test(formData.contract_start_date)) newErrors.contract_start_date = 'Invalid start date.';
    if (!dateRegex.test(formData.contract_expire_date)) newErrors.contract_expire_date = 'Invalid end date.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for adding a new customer
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Send data to backend using POST request
    fetch('http://localhost:3000/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Customer added:', data);
        setCustomers([...customers, data]); // Add the new customer to the list
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          company_name: '',
          phone: '',
          profile_picture_url: '',
          contract_start_date: '',
          contract_expire_date: '',
        });
      })
      .catch((error) => {
        console.error('Error adding customer:', error);
      });
  };

  // Handle delete customer
  const handleDelete = (customerId) => {
    fetch(`http://localhost:3000/customers/${customerId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete customer');
        console.log('Customer deleted');
        // Remove customer from state
        setCustomers(customers.filter((customer) => customer.id !== customerId));
      })
      .catch((error) => {
        console.error('Error deleting customer:', error);
      });
  };


  // html to be returned
  return (
    <>
      <img
        src="https://reidpetroleum.com/wp-content/uploads/2014/03/ReidLogo.png"
      ></img>
      <h1>Customer Directory</h1>
      <div className="card">
        <button onClick={() => setShowModal(true)}>Add Customer</button>
      </div>


      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
      </div>


      <div className="customer-list" style={{ maxHeight: '400px', overflowY: 'auto', width: '1000px' }}>
      {customers
        .filter((customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.company_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((customer) => (
          <div key={customer.id} className="customer-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img
              src={customer.profile_picture_url}
              alt={`${customer.name}'s profile`}
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
            />
            <div>
              <h3>{customer.name}</h3>
              <p>Email: {customer.email}</p>
              <p>Company: {customer.company_name}</p>
              <p>Phone: {customer.phone}</p>
              <p>Contract: {new Date(customer.contract_start_date).toISOString().split('T')[0]} to {new Date(customer.contract_expire_date).toISOString().split('T')[0]}</p>
            </div>
            <button onClick={() => handleDelete(customer.id)} style={{backgroundColor: 'red',marginLeft: 'auto' }}>Delete Customer</button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Customer</h2>
            <form onSubmit={handleSubmit}>
              {['name', 'email', 'company_name', 'phone', 'profile_picture_url', 'contract_start_date', 'contract_expire_date'].map((field) => (
                <div key={field}>
                  <label>{field.replace(/_/g, ' ')}:</label><br />
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                  {errors[field] && <p style={{ color: 'red' }}>{errors[field]}</p>}
                </div>
              ))}
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;