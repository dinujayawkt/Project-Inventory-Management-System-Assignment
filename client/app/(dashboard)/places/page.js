'use client';

import { useState, useEffect } from 'react';
import placeService from '@/lib/placeService';
import cupboardService from '@/lib/cupboardService';
import { Modal, Alert, Button, LoadingSpinner } from '@/components/UI';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [cupboards, setCupboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', cupboard_id: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [placesData, cupsData] = await Promise.all([
        placeService.getAll(),
        cupboardService.getAll(),
      ]);
      setPlaces(placesData);
      setCupboards(cupsData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (place = null) => {
    if (place) {
      setFormData({ name: place.name, cupboard_id: place.cupboard_id });
      setEditingId(place.id);
    } else {
      setFormData({ name: '', cupboard_id: cupboards[0]?.id || '' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      if (editingId) {
        await placeService.update(editingId, formData);
        setSuccess('Place updated successfully');
      } else {
        await placeService.create(formData);
        setSuccess('Place created successfully');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save place');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this place?')) return;

    setDeleteLoading(id);
    try {
      await placeService.delete(id);
      setSuccess('Place deleted successfully');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete place');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📍 Places</h1>
        <Button onClick={() => handleOpenModal()} variant="primary">
          + New Place
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {places.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No places yet</p>
            <p className="text-sm">Create a place inside a cupboard to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cupboard</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{place.name}</td>
                  <td className="px-6 py-4 text-gray-600">{place.cupboard?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(place.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(place)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(place.id)}
                      disabled={deleteLoading === place.id}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      {deleteLoading === place.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} title={editingId ? 'Edit Place' : 'New Place'} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Place name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cupboard</label>
            <select
              value={formData.cupboard_id}
              onChange={(e) => setFormData({ ...formData, cupboard_id: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a cupboard</option>
              {cupboards.map((cupboard) => (
                <option key={cupboard.id} value={cupboard.id}>
                  {cupboard.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={submitLoading} className="flex-1">
              {editingId ? 'Update' : 'Create'}
            </Button>
            <Button type="button" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
