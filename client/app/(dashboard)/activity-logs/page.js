'use client';

import { useState, useEffect } from 'react';
import activityLogService from '@/lib/activityLogService';
import { LoadingSpinner, Alert } from '@/components/UI';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await activityLogService.getAll();
      setLogs(data);
      setError('');
    } catch (err) {
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'borrowed':
        return 'bg-purple-100 text-purple-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'created':
        return '✨';
      case 'updated':
        return '✏️';
      case 'deleted':
        return '🗑️';
      case 'borrowed':
        return '📤';
      case 'returned':
        return '📥';
      default:
        return '📝';
    }
  };

  let filteredLogs = logs;

  if (filterType !== 'all') {
    filteredLogs = filteredLogs.filter((log) => log.entity_type === filterType);
  }

  if (filterAction !== 'all') {
    filteredLogs = filteredLogs.filter((log) => log.action === filterAction);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">📋 Activity Logs</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="item">Items</option>
            <option value="cupboard">Cupboards</option>
            <option value="place">Places</option>
            <option value="user">Users</option>
          </select>
        </div>
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No activity logs found</p>
            <p className="text-sm">Logs will appear here as you perform actions in the system.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getActionIcon(log.action)}</span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {log.user?.name || 'Unknown User'}{' '}
                        <span className={`px-2 py-1 ml-2 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {log.entity_type} (ID: {log.entity_id})
                      </p>
                    </div>
                  </div>

                  {(log.old_value || log.new_value) && (
                    <div className="bg-gray-50 rounded p-3 mt-3 text-sm">
                      {log.old_value && (
                        <div className="text-red-600 mb-1">
                          <span className="font-medium">Before:</span> {log.old_value}
                        </div>
                      )}
                      {log.new_value && (
                        <div className="text-green-600">
                          <span className="font-medium">After:</span> {log.new_value}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right text-xs text-gray-500 ml-4 whitespace-nowrap">
                  <p>{new Date(log.created_at).toLocaleDateString()}</p>
                  <p>{new Date(log.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
