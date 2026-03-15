import React from 'react';
import { Activity } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100">
          <Activity className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
        <p className="text-primary-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
