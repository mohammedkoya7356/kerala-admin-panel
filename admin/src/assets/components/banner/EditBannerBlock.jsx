import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Image, Spinner } from 'react-bootstrap';

const EditBannerBlock = () => {
  const { id, block } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ heading: '', subheading: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/banner`);
        const banner = res.data.find(b => b._id === id);
        if (banner && banner[block]) {
          setForm({
            heading: banner[block].heading,
            subheading: banner[block].subheading,
          });
          setPreview(`http://localhost:5000/${banner[block].image.replace(/\\/g, '/')}`);
        } else {
          setVariant('danger');
          setMessage(' Block not found');
        }
      } catch (err) {
        setVariant('danger');
        setMessage(' Failed to fetch banner');
      }
    };

    fetchBanner();
  }, [id, block]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('heading', form.heading);
    formData.append('subheading', form.subheading);
    if (image) formData.append('image', image);

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/banner/${id}/${block}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setVariant('success');
      setMessage(res.data.message || 'Block updated');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      setVariant('danger');
      setMessage(error.response?.data?.error || ' Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h3 className="mb-3"> Edit {block.toUpperCase()} Block</h3>

      {message && <Alert variant={variant}>{message}</Alert>}

      {preview && (
        <div className="mb-3">
          <Image src={preview} alt="Preview" width={300} rounded />
        </div>
      )}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Heading</Form.Label>
          <Form.Control
            type="text"
            name="heading"
            value={form.heading}
            onChange={handleChange}
            placeholder="Enter heading"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subheading</Form.Label>
          <Form.Control
            type="text"
            name="subheading"
            value={form.subheading}
            onChange={handleChange}
            placeholder="Enter subheading"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Replace Image (optional)</Form.Label>
          <Form.Control type="file" name="image" onChange={handleFileChange} accept="image/*" />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Update Block'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditBannerBlock;
