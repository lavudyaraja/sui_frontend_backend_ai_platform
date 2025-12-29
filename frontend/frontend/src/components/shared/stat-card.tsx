'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
}

export function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="bg-indigo-100 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}