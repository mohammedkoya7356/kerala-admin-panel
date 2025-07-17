import React, { useState } from 'react';
import axios from 'axios';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Image,
} from 'react-bootstrap';

const API_URL = 'http://localhost:5000/api/banner';

const CreateNewBanner = () => {
  const [formData, setFormData] = useState({
    img1Heading: '',
    img1Subheading: '',
    img2Heading: '',
    img2Subheading: '',
    img3Heading: '',
    img3Subheading: '',
  });

  const [images, setImages] = useState({});
  const [previews, setPreviews] = useState({});
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [loading, setLoading] = useState(false);

  //  Handle heading/subheading input
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle image selection
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
    if (!isValidType) {
      setVariant('danger');
      setMessage(' Only JPG, JPEG, or PNG files are allowed.');
      return;
    }

    setImages((prev) => ({ ...prev, [name]: file }));
    setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  //  Submit banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = new FormData();

    // Add images
    Object.entries(images).forEach(([key, file]) => {
      data.append(key, file);
    });

    // Add headings and subheadings
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post(API_URL, data);
      setVariant('success');
      setMessage(response.data?.message || 'Banner created successfully!');

      // Reset form
      setFormData({
        img1Heading: '',
        img1Subheading: '',
        img2Heading: '',
        img2Subheading: '',
        img3Heading: '',
        img3Subheading: '',
      });
      setImages({});
      setPreviews({});
    } catch (error) {
      setVariant('danger');
      setMessage(
        error.response?.data?.error ||
        error.response?.data?.message ||
        ' Upload failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">Create New Banner</h3>

        {message && <Alert variant={variant}>{message}</Alert>}

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          {[1, 2, 3].map((i) => {
            const imgKey = `img${i}`;
            return (
              <Row key={i} className="mb-4 border-bottom pb-3">
                <Col md={12}>
                  <h5> Banner Image {i}</h5>
                </Col>

                <Col md={3}>
                  <Form.Group controlId={imgKey}>
                    <Form.Label>Choose Image</Form.Label>
                    <Form.Control
                      type="file"
                      name={imgKey}
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group controlId={`${imgKey}Heading`}>
                    <Form.Label>Heading</Form.Label>
                    <Form.Control
                      type="text"
                      name={`${imgKey}Heading`}
                      placeholder={`Heading ${i}`}
                      value={formData[`${imgKey}Heading`]}
                      onChange={handleTextChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group controlId={`${imgKey}Subheading`}>
                    <Form.Label>Subheading</Form.Label>
                    <Form.Control
                      type="text"
                      name={`${imgKey}Subheading`}
                      placeholder={`Subheading ${i}`}
                      value={formData[`${imgKey}Subheading`]}
                      onChange={handleTextChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3} className="d-flex align-items-center">
                  {previews[imgKey] ? (
                    <Image
                      src={previews[imgKey]}
                      rounded
                      fluid
                      alt={`Preview ${imgKey}`}
                      style={{ maxHeight: '100px' }}
                    />
                  ) : (
                    <span className="text-muted">No preview</span>
                  )}
                </Col>
              </Row>
            );
          })}

          <div className="text-end">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Uploading...' : ' Upload Banner'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateNewBanner;
