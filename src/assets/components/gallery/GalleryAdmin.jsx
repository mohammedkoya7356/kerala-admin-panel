import React, { useEffect, useState } from 'react';
import axios from 'axios';

const blocks = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6'];
const MAX_SIZE_MB = 15;

const BASE_URL = 'https://kerala-travel-2.onrender.com';

const GalleryAdmin = () => {
  const [gallery, setGallery] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [titles, setTitles] = useState({});

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/gallery`);
      const dataMap = {};
      const titleMap = {};
      res.data.forEach(item => {
        dataMap[item.block] = item;
        titleMap[item.block] = item.title || '';
      });
      setGallery(dataMap);
      setTitles(titleMap);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      alert('Failed to load gallery data.');
    }
  };

  const handleFileChange = (e, block) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Max allowed size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSelectedFiles(prev => ({ ...prev, [block]: file }));
  };

  const handleTitleChange = (e, block) => {
    setTitles(prev => ({ ...prev, [block]: e.target.value }));
  };

  const uploadImage = async (block) => {
    const formData = new FormData();
    const file = selectedFiles[block];
    const title = titles[block];

    if (!file && (!gallery[block] || title === gallery[block]?.title)) {
      alert('Please select a file or change the title before uploading.');
      return;
    }

    if (file) {
      formData.append('image', file);
    }

    formData.append('block', block);
    formData.append('title', title || '');

    try {
      const res = await axios.post(`${BASE_URL}/api/gallery/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload success:', res.data);
      fetchGallery();
      setSelectedFiles(prev => ({ ...prev, [block]: null }));
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert(`Upload failed: ${error.response?.data?.error || 'Server error'}`);
    }
  };

  const deleteImage = async (block) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/gallery/${block}`);
      fetchGallery();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete image.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gallery Management</h2>
      <div className="row">
        {blocks.map((block) => (
          <div className="col-md-4 mb-4" key={block}>
            <div className="card shadow-sm">
              {gallery[block]?.image ? (
                <img
                  src={`${BASE_URL}/uploads/gallery/${gallery[block].image}`}
                  className="card-img-top"
                  alt={block}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="card-img-top d-flex align-items-center justify-content-center bg-light"
                  style={{ height: '200px', fontSize: '1.5rem', color: '#ccc' }}
                >
                  No Image
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title text-uppercase">{block}</h5>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter title"
                  value={titles[block] || ''}
                  onChange={(e) => handleTitleChange(e, block)}
                />

                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => handleFileChange(e, block)}
                />

                <div className="d-flex justify-content-between mt-2">
                  <button
                    className={`btn btn-primary btn-sm ${!selectedFiles[block] && titles[block] === gallery[block]?.title ? 'disabled-button' : ''}`}
                    onClick={() => {
                      if (selectedFiles[block] || titles[block] !== gallery[block]?.title) {
                        uploadImage(block);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {gallery[block] ? 'Update' : 'Upload'}
                  </button>

                  {gallery[block] && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteImage(block)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryAdmin;
