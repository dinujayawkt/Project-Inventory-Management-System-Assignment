'use client';

import { useState, useEffect } from 'react';
import borrowService from '@/lib/borrowService';
import itemService from '@/lib/itemService';
import { Modal, Alert, Button, LoadingSpinner } from '@/components/UI';

export default function BorrowingPage() {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('borrowed');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    item_id: '',
    borrower_name: '',
    contact: '',
    quantity: '',
    borrow_date: new Date().toISOString().split('T')[0],
    expected_return_date: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [borrowed, returned, itemsData] = await Promise.all([
        borrowService.getBorrowedItems(),
        borrowService.getReturnedItems(),
        itemService.getAll(),
      ]);
      setBorrowedItems(borrowed);
      setReturnedItems(returned);
      setItems(itemsData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      item_id: items[0]?.id || '',
      borrower_name: '',
      contact: '',
      quantity: '',
      borrow_date: new Date().toISOString().split('T')[0],
      expected_return_date: '',
    });
    setShowModal(true);
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
      await borrowService.borrowItem(submitData);
      setSuccess('Item borrowed successfully');
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow item');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (!confirm('Mark this item as returned?')) return;

    setReturnLoading(id);
    try {
      await borrowService.returnItem(id);
      setSuccess('Item returned successfully');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return item');
    } finally {
      setReturnLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">🔄 Borrowing System</h1>
        <Button onClick={handleOpenModal} variant="primary">
          + Borrow Item
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'borrowed' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Currently Borrowed ({borrowedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('returned')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'returned' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Returned ({returnedItems.length})
        </button>
      </div>

      {/* Borrowed Items Table */}
      {activeTab === 'borrowed' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {borrowedItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">No items currently borrowed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Borrower</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Qty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Period</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedItems.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800 font-medium">{record.item?.name}</td>
                      <td className="px-6 py-4 text-gray-600">{record.borrower_name}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{record.contact}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-gray-100 rounded">{record.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(record.borrow_date).toLocaleDateString()} →{' '}
                        {new Date(record.expected_return_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleReturn(record.id)}
                          disabled={returnLoading === record.id}
                          className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                        >
                          {returnLoading === record.id ? 'Processing...' : 'Mark Returned'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Returned Items Table */}
      {activeTab === 'returned' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {returnedItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">No items returned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Borrower</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Qty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Borrow Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Returned</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedItems.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800 font-medium">{record.item?.name}</td>
                      <td className="px-6 py-4 text-gray-600">{record.borrower_name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-gray-100 rounded">{record.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(record.borrow_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">
                        {new Date(record.returned_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Borrow Form Modal */}
      <Modal isOpen={showModal} title="Borrow Item" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item *</label>
            <select
              value={formData.item_id}
              onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an item</option>
              {items
                .filter((item) => item.quantity > 0)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Available: {item.quantity})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Name *</label>
            <input
              type="text"
              value={formData.borrower_name}
              onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Phone or email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Borrow Date</label>
            <input
              type="date"
              value={formData.borrow_date}
              onChange={(e) => setFormData({ ...formData, borrow_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return Date *</label>
            <input
              type="date"
              value={formData.expected_return_date}
              onChange={(e) => setFormData({ ...formData, expected_return_date: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={submitLoading} className="flex-1">
              Borrow
            </Button>
            <Button type="button" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
