'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Student {
  student_id: string;
  name: string;
  credit_total: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Student[];
}

export default function HomePage() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ApiResponse>('/students')
      .then((res) => setStudents(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Students</h1>

      {loading && (
        <p className="text-gray-500 text-sm">Loading...</p>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 rounded p-4">
          Error: {error}
        </div>
      )}

      {students && (
        <pre className="bg-white border border-gray-200 rounded p-4 text-sm overflow-auto">
          {JSON.stringify(students, null, 2)}
        </pre>
      )}
    </main>
  );
}
