'use client';

import { useState, useEffect } from 'react';
import cupboardService from '@/lib/cupboardService';
import { Modal, Alert, Button, LoadingSpinner } from '@/components/UI';

export default function CupboardsPage() {
  const [cupboards, setCupboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadCupboards();
  }, []);

  const loadCupboards = async () => {
    setLoading(true);
    try {
      const data = await cupboardService.getAll();
      setCupboards(data);
      setError('');
    } catch (err) {
      setError('Failed to load cupboards');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cupboard = null) => {
    if (cupboard) {
      setFormData({ name: cupboard.name });
      setEditingId(cupboard.id);
    } else {
      setFormData({ name: '' });
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
        await cupboardService.update(editingId, formData);
        setSuccess('Cupboard updated successfully');
      } else {
        await cupboardService.create(formData);
        setSuccess('Cupboard created successfully');
      }
      setShowModal(false);
      loadCupboards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save cupboard');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this cupboard?')) return;

    setDeleteLoading(id);
    try {
      await cupboardService.delete(id);
      setSuccess('Cupboard deleted successfully');
      loadCupboards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete cupboard');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">🗄️ Cupboards</h1>
        <Button onClick={() => handleOpenModal()} variant="primary">
          + New Cupboard
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {cupboards.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No cupboards yet</p>
            <p className="text-sm">Create your first cupboard to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cupboards.map((cupboard) => (
                <tr key={cupboard.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{cupboard.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(cupboard.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(cupboard)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cupboard.id)}
                      disabled={deleteLoading === cupboard.id}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      {deleteLoading === cupboard.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} title={editingId ? 'Edit Cupboard' : 'New Cupboard'} onClose={handleCloseModal}>
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
              placeholder="Cupboard name"
            />
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
