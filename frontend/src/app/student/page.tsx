'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStudents } from '@/services/student.service';
import { Student } from '@/types/student';

const ICON_COLORS = [
  'bg-[#d8e2ff]/30 text-[#005bbf]',
  'bg-[#6ddd81]/30 text-[#006e2c]',
  'bg-[#fbbc05]/30 text-[#795900]',
];

export default function SelectStudentPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getStudents()
      .then((data: Student[]) => { setStudents(data); setFiltered(data); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(students.filter((s) =>
      s.name.toLowerCase().includes(term) || s.student_id.toLowerCase().includes(term)
    ));
  }, [search, students]);

  return (
    <div
      className="min-h-screen text-[#181c20]"
      style={{
        backgroundColor: '#f7f9ff',
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(216,226,255,0.4) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(134,248,152,0.1) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(173,199,255,0.3) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(255,223,160,0.2) 0px, transparent 50%)
        `,
      }}
    >
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#c1c6d6]/50 shadow-[0_1px_3px_rgba(0,0,0,0.05)] h-20 flex items-center px-8">
        <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
          <div className="w-10 h-10 bg-[#1a73e8] rounded-xl flex items-center justify-center text-white text-lg">
            🎓
          </div>
          <h1 className="text-[#005bbf] text-xl font-bold tracking-tight">Course Booking System</h1>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-[#181c20] mb-4 tracking-tight">
            Please select a student to proceed with course booking
          </h2>
          <p className="text-[#414754] max-w-2xl leading-relaxed">
            Search and manage course information for students under your care efficiently through our modernized portal.
          </p>
        </div>

        {/* Search */}
        <div className="mb-12 max-w-md">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#727785] group-focus-within:text-[#005bbf] transition-colors">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or student ID..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#c1c6d6] rounded-2xl focus:ring-4 focus:ring-[#005bbf]/10 focus:border-[#005bbf] outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#005bbf] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((student, i) => (
              <div
                key={student.student_id}
                className="group bg-white border border-[#c1c6d6]/60 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-[#005bbf]/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden relative flex flex-col justify-between"
              >
                <div className={`absolute top-0 right-0 p-4`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${ICON_COLORS[i % ICON_COLORS.length]}`}>
                    👤
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#181c20] mb-2 group-hover:text-[#005bbf] transition-colors">
                      {student.name}
                    </h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ebeef4] rounded-lg">
                      <span className="text-[#414754] text-xs">🪪</span>
                      <p className="text-sm text-[#414754] font-mono tracking-wider">{student.student_id}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/booking/${student.student_id}`)}
                    className="w-full bg-[#005bbf] text-white font-bold py-4 rounded-xl hover:bg-[#1a73e8] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-[#005bbf]/10 group-hover:shadow-[#005bbf]/30 group-hover:gap-5"
                  >
                    Select Student
                    <span>→</span>
                  </button>
                </div>

                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#005bbf]/5 rounded-full blur-3xl group-hover:bg-[#005bbf]/10 transition-colors pointer-events-none" />
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="col-span-3 text-center text-[#414754] py-12">No students found</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
