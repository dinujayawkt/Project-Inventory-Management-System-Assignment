'use client';

import { useState, useEffect } from 'react';
import itemService from '@/lib/itemService';
import placeService from '@/lib/placeService';
import { Modal, Alert, Button, LoadingSpinner } from '@/components/UI';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [quantityItemId, setQuantityItemId] = useState(null);
  const [quantityAction, setQuantityAction] = useState('add');
  const [quantityAmount, setQuantityAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    quantity: '',
    serial_number: '',
    description: '',
    place_id: '',
    status: 'In-Store',
    image: '',
  });
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
      const [itemsData, placesData] = await Promise.all([
        itemService.getAll(),
        placeService.getAll(),
      ]);
      setItems(itemsData);
      setPlaces(placesData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        serial_number: item.serial_number || '',
        description: item.description || '',
        place_id: item.place_id,
        status: item.status || 'In-Store',
        image: item.image || '',
      });
      setEditingId(item.id);
    } else {
      setFormData({
        name: '',
        code: '',
        quantity: '',
        serial_number: '',
        description: '',
        place_id: places[0]?.id || '',
        status: 'In-Store',
        image: '',
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleOpenQuantityModal = (item) => {
    setQuantityItemId(item.id);
    setQuantityAmount('');
    setQuantityAction('add');
    setShowQuantityModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      const submitData = {
        ...formData,
        quantity: parseInt(formData.quantity),
      };

      if (editingId) {
        await itemService.update(editingId, submitData);
        setSuccess('Item updated successfully');
      } else {
        await itemService.create(submitData);
        setSuccess('Item created successfully');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleQuantitySubmit = async (e) => {
    e.preventDefault();
    if (!quantityAmount || isNaN(quantityAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitLoading(true);
    try {
      const amount = parseInt(quantityAmount);
      if (quantityAction === 'add') {
        await itemService.incrementQuantity(quantityItemId, amount);
        setSuccess(`Added ${amount} items to stock`);
      } else {
        await itemService.decrementQuantity(quantityItemId, amount);
        setSuccess(`Removed ${amount} items from stock`);
      }
      setShowQuantityModal(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setDeleteLoading(id);
    try {
      await itemService.delete(id);
      setSuccess('Item deleted successfully');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'In-Store':
        return 'bg-green-100 text-green-800';
      case 'Borrowed':
        return 'bg-blue-100 text-blue-800';
      case 'Damaged':
        return 'bg-red-100 text-red-800';
      case 'Missing':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📦 Items</h1>
        <Button onClick={() => handleOpenModal()} variant="primary">
          + New Item
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No items yet</p>
            <p className="text-sm">Create your first item to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Qty</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{item.code}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 rounded">{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{item.place?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenQuantityModal(item)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        ± Qty
                      </button>
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteLoading === item.id}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        {deleteLoading === item.id ? 'Del...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Item Form Modal */}
      <Modal isOpen={showModal} title={editingId ? 'Edit Item' : 'New Item'} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          {error && <Alert type="error" message={error} />}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Item name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              disabled={editingId !== null}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Unique item code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number (Optional)</label>
            <input
              type="text"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Serial number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place *</label>
            <select
              value={formData.place_id}
              onChange={(e) => setFormData({ ...formData, place_id: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a place</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name} ({place.cupboard?.name})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>In-Store</option>
              <option>Borrowed</option>
              <option>Damaged</option>
              <option>Missing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Item description"
              rows="2"
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

      {/* Quantity Modal */}
      <Modal
        isOpen={showQuantityModal}
        title="Adjust Quantity"
        onClose={() => setShowQuantityModal(false)}
      >
        <form onSubmit={handleQuantitySubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={quantityAction}
              onChange={(e) => setQuantityAction(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="add">Add to Stock</option>
              <option value="remove">Remove from Stock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={quantityAmount}
              onChange={(e) => setQuantityAmount(e.target.value)}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={submitLoading} className="flex-1">
              Update
            </Button>
            <Button type="button" onClick={() => setShowQuantityModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
