'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { APP_CONSTANTS } from '@/constants';

export default function SettingsPage() {
  const { user, isAdmin, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Profile Info */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <p className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                {user?.name || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                {user?.email || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
              <p className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {user?.role || 'USER'}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              <p className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                {user?.phone || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* App Info */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Info</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">App Name</span>
            <span className="font-medium text-gray-800">{APP_CONSTANTS.APP_NAME}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Description</span>
            <span className="font-medium text-gray-800">{APP_CONSTANTS.APP_DESCRIPTION}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Currency</span>
            <span className="font-medium text-gray-800">{APP_CONSTANTS.DEFAULT_CURRENCY} (INR)</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Date Format</span>
            <span className="font-medium text-gray-800">{APP_CONSTANTS.DATE_FORMAT}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Version</span>
            <span className="font-medium text-gray-800">v1.0.0</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          {!showLogoutConfirm ? (
            <Button variant="danger" onClick={() => setShowLogoutConfirm(true)}>
              Logout
            </Button>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 flex-1">Are you sure you want to logout?</p>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                Yes, Logout
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
