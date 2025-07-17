import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ Load from VITE .env variable
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/contact`);
      setContacts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load contact submissions.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`${BASE_URL}/api/contact/${id}`);
        setContacts(prev => prev.filter(contact => contact._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert(" Failed to delete contact.");
      }
    }
  };

  return (
    <div>
      <h3>Contact Submissions</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No contact submissions yet.</td>
            </tr>
          ) : (
            contacts.map((c, index) => (
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.message}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
