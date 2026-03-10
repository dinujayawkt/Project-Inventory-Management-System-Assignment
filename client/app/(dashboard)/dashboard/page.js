'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import cupboardService from '@/lib/cupboardService';
import placeService from '@/lib/placeService';
import itemService from '@/lib/itemService';
import borrowService from '@/lib/borrowService';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    cupboards: 0,
    places: 0,
    items: 0,
    borrowed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [cupboards, places, items, borrowed] = await Promise.all([
          cupboardService.getAll(),
          placeService.getAll(),
          itemService.getAll(),
          borrowService.getBorrowedItems(),
        ]);

        setStats({
          cupboards: cupboards.length,
          places: places.length,
          items: items.length,
          borrowed: borrowed.length,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-slideIn">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
        <p className="text-gray-500 text-lg">Here's what's happening with your inventory today.</p>
      </div>

      {/* Stats Grid with modern cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Cupboards */}
        <Link href="/cupboards" className="bg-white rounded-2xl p-6 card-shadow-hover border border-gray-100 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Cupboards</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.cupboards}</p>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">Active</span>
            <span className="text-gray-400 ml-2">storage units</span>
          </div>
        </Link>

        {/* Storage Places */}
        <Link href="/places" className="bg-white rounded-2xl p-6 card-shadow-hover border border-gray-100 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Storage Places</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.places}</p>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">Organized</span>
            <span className="text-gray-400 ml-2">locations</span>
          </div>
        </Link>

        {/* Total Items */}
        <Link href="/items" className="bg-white rounded-2xl p-6 card-shadow-hover border border-gray-100 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Items</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.items}</p>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">In stock</span>
            <span className="text-gray-400 ml-2">inventory items</span>
          </div>
        </Link>

        {/* Items Borrowed */}
        <Link href="/borrowing" className="bg-white rounded-2xl p-6 card-shadow-hover border border-gray-100 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Items Borrowed</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.borrowed}</p>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-amber-600 font-medium">Currently out</span>
            <span className="text-gray-400 ml-2">by staff</span>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/items" className="group bg-white rounded-2xl p-7 card-shadow-hover border border-gray-100 transition-all">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mr-5 group-hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Inventory</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">Organize your cupboards, places, and items efficiently.</p>
              <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                Go to Items 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        <Link href="/borrowing" className="group bg-white rounded-2xl p-7 card-shadow-hover border border-gray-100 transition-all">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mr-5 group-hover:bg-emerald-100 transition-colors">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Borrowing System</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">Track items borrowed by staff and manage returns.</p>
              <span className="inline-flex items-center text-emerald-600 text-sm font-medium group-hover:gap-2 transition-all">
                Go to Borrowing 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        <Link href="/activity-logs" className="group bg-white rounded-2xl p-7 card-shadow-hover border border-gray-100 transition-all">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mr-5 group-hover:bg-purple-100 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Logs</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">View all changes and actions performed in the system.</p>
              <span className="inline-flex items-center text-purple-600 text-sm font-medium group-hover:gap-2 transition-all">
                View Logs 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {user?.role === 'admin' && (
          <Link href="/users" className="group bg-white rounded-2xl p-7 card-shadow-hover border border-gray-100 transition-all">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mr-5 group-hover:bg-amber-100 transition-colors">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">Create and manage user accounts (Admin only).</p>
                <span className="inline-flex items-center text-amber-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Manage Users 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
