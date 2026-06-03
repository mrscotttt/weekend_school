'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStudentCredits } from '@/services/student.service';
import { getClasses } from '@/services/class.service';
import { bookClass, attendClass, skipClass, absentClass } from '@/services/booking.service';
import { StudentCredit } from '@/types/student';
import { ClassItem, AttendanceStatus } from '@/types/class';

interface ConfirmModal {
  classId: string;
  className: string;
  action: 'book' | 'attend' | 'skip' | 'absent';
  label: string;
}

const STATUS_CONFIG: Record<AttendanceStatus, { badge: string; badgeBg: string; borderTop: string }> = {
  READY_TO_BOOK: { badge: 'Ready to Book', badgeBg: 'bg-[#86f898] text-[#00722f]', borderTop: 'border-t-[#005bbf]' },
  BOOKED:        { badge: 'Booked',         badgeBg: 'bg-[#d8e2ff] text-[#004493]', borderTop: 'border-t-[#005bbf]' },
  ATTEND:        { badge: 'Attended',        badgeBg: 'bg-[#ffdfa0] text-[#5c4300]', borderTop: 'border-t-[#795900]' },
  SKIP:          { badge: 'Skipped',         badgeBg: 'bg-[#ffdfa0] text-[#5c4300]', borderTop: 'border-t-[#795900]' },
  ABSENT:        { badge: 'Absent',          badgeBg: 'bg-[#ffdad6] text-[#93000a]', borderTop: 'border-t-[#ba1a1a]' },
};

export default function BookingPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const router = useRouter();

  const [credit, setCredit] = useState<StudentCredit | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [modal, setModal] = useState<ConfirmModal | null>(null);

  const showToast = (message: string, ok: boolean) => {
    setToast({ message, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      const [creditData, classData] = await Promise.all([
        getStudentCredits(studentId),
        getClasses(studentId),
      ]);
      setCredit(creditData);
      setClasses(classData);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to load data', false);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleConfirm = async () => {
    if (!modal) return;
    const { classId, action } = modal;
    setModal(null);
    setLoadingAction(`${action}-${classId}`);
    try {
      let res;
      if (action === 'book') res = await bookClass(studentId, classId);
      else if (action === 'attend') res = await attendClass(studentId, classId);
      else if (action === 'skip') res = await skipClass(studentId, classId);
      else res = await absentClass(studentId, classId);

      showToast(res.message, res.success);
      if (res.success) await loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Something went wrong', false);
    } finally {
      setLoadingAction(null);
    }
  };

  const openModal = (classId: string, className: string, action: ConfirmModal['action'], label: string) => {
    setModal({ classId, className, action, label });
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#181c20]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-xs font-medium max-w-xs ${toast.ok ? 'bg-[#006e2c] text-white' : 'bg-[#ba1a1a] text-white'}`}>
          <span>{toast.ok ? '✓' : '✕'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirm Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#86f898] text-[#006e2c] rounded-full flex items-center justify-center mb-6 text-4xl">
                ✓
              </div>
              <h2 className="text-xl font-semibold mb-3">Confirm {modal.label}</h2>
              <p className="text-[#414754] mb-8 leading-relaxed">
                Do you want to confirm <span className="font-bold text-[#181c20]">{modal.label}</span> for{' '}
                <span className="font-bold text-[#181c20]">{modal.className}</span>?
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => setModal(null)}
                  className="py-3.5 rounded-xl border border-[#727785] text-[#181c20] font-semibold hover:bg-[#ebeef4] transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="py-3.5 rounded-xl bg-[#005bbf] text-white font-semibold hover:bg-[#1a73e8] hover:shadow-lg transition-all active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#f7f9ff]/80 backdrop-blur-md border-b border-[#c1c6d6] shadow-sm flex items-center justify-between px-6 h-16 md:h-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/student')}
            className="text-[#005bbf] p-2 hover:bg-[#e5e8ee] rounded-full transition-all active:scale-95"
          >
            ←
          </button>
          <span className="text-[#005bbf] font-semibold text-lg tracking-tight">Course Booking System</span>
        </div>
        <a
          href="/student"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-[#86f898] text-[#00722f] rounded-full font-semibold text-sm hover:shadow-md transition-shadow active:scale-95"
        >
          🏠 Choose Student
        </a>
      </nav>

      <main className="pt-28 pb-20 md:pb-12 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#005bbf] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Header + Credits */}
            <header className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#181c20] mb-2 tracking-tight">Available Courses for Registration</h1>
                  <p className="text-[#414754] text-sm">📅 Upcoming Classes | <span className="text-[#006e2c] font-medium">Registration is now open</span></p>
                </div>
                {credit && (
                  <div className="bg-[#005bbf]/5 border border-[#005bbf]/10 text-[#005bbf] px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                    <span className="text-2xl">💳</span>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider opacity-70 font-semibold">Remaining Credits</span>
                      <span className="text-lg font-bold">{Number(credit.remaining_credit)} Credits</span>
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.length === 0 && (
                <p className="col-span-3 text-center text-[#414754] py-12">No upcoming classes</p>
              )}
              {classes.map((cls, index) => (
                <CourseCard
                  key={cls.classId+index}
                  cls={cls}
                  loadingAction={loadingAction}
                  noCredits={credit ? Number(credit.remaining_credit) <= 0 : false}
                  onAction={openModal}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function CourseCard({
  cls,
  loadingAction,
  noCredits,
  onAction,
}: {
  cls: ClassItem;
  loadingAction: string | null;
  noCredits: boolean;
  onAction: (classId: string, className: string, action: ConfirmModal['action'], label: string) => void;
}) {
  const cfg = STATUS_CONFIG[cls.attendanceStatus];
  const classDate = new Date(cls.classDate);
  const dateStr = classDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = classDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const isFull = cls.seatAvailable <= 0;

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm border border-[#dadce0]/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border-t-4 overflow-hidden ${cfg.borderTop}`}
    >
      <div>
        {/* Top row */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold px-3 py-1 bg-[#d8e2ff]/50 text-[#004493] rounded-lg border border-[#005bbf]/10">
            {cls.courseId}
          </span>
          <span className={`px-4 py-1 rounded-full text-[11px] uppercase tracking-wide font-bold shadow-sm ${cfg.badgeBg}`}>
            {cfg.badge}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-semibold text-[#181c20] mb-3 leading-snug">{cls.className}</h3>

        {/* Description */}
        {cls.description && (
          <p className="text-sm text-[#414754] line-clamp-2 mb-6 leading-relaxed">{cls.description}</p>
        )}

        {/* Meta */}
        <div className="space-y-3 mb-8 bg-[#f1f4fa]/50 p-4 rounded-xl">
          <div className="flex items-center gap-3 text-[#414754]">
            <span className="text-[#005bbf]">📅</span>
            <span className="text-sm font-semibold">{dateStr} · {timeStr}</span>
          </div>
          {cls.attendanceStatus === 'READY_TO_BOOK' || cls.attendanceStatus === 'BOOKED' ? (
            <div className="flex items-center gap-3 text-[#414754]">
              <span className="text-[#005bbf]">👥</span>
              <span className="text-sm font-semibold">
                Available:{' '}
                <span className={`font-bold ${isFull ? 'text-[#ba1a1a]' : 'text-[#181c20]'}`}>
                  {cls.seatAvailable} / {cls.seatTotal}
                </span>{' '}seats
              </span>
            </div>
          ) : null}
          {cls.hasSkippedBefore && (
            <div className="flex items-center gap-2 text-[#795900] text-sm">
              <span>↩</span> Has makeup compensation
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <ActionButtons cls={cls} loadingAction={loadingAction} noCredits={noCredits} onAction={onAction} isFull={isFull} />
    </div>
  );
}

function ActionButtons({
  cls,
  loadingAction,
  noCredits,
  onAction,
  isFull,
}: {
  cls: ClassItem;
  loadingAction: string | null;
  noCredits: boolean;
  onAction: (classId: string, className: string, action: ConfirmModal['action'], label: string) => void;
  isFull: boolean;
}) {
  const isLoading = (action: string) => loadingAction === `${action}-${cls.classId}`;
  const anyLoading = !!loadingAction;

  if (cls.attendanceStatus === 'READY_TO_BOOK') {
    const disabled = isFull || anyLoading || noCredits;
    return (
      <button
        onClick={() => onAction(cls.classId, cls.className, 'book', 'Book Course')}
        disabled={disabled}
        className="w-full bg-gradient-to-br from-[#005bbf] to-[#1a73e8] text-white py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all hover:shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading('book') ? <Spinner /> : isFull ? 'Fully Booked' : noCredits ? 'No Credits' : 'Book Course'}
      </button>
    );
  }

  if (cls.attendanceStatus === 'BOOKED') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => onAction(cls.classId, cls.className, 'attend', 'Attend')}
          disabled={anyLoading || noCredits}
          className="flex-1 bg-gradient-to-br from-[#006e2c] to-[#00a140] text-white py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading('attend') ? <Spinner /> : 'Attend'}
        </button>
        <button
          onClick={() => onAction(cls.classId, cls.className, 'skip', 'Skip')}
          disabled={anyLoading || noCredits}
          className="flex-1 bg-gradient-to-br from-[#795900] to-[#a17700] text-white py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading('skip') ? <Spinner /> : 'Skip'}
        </button>
        <button
          onClick={() => onAction(cls.classId, cls.className, 'absent', 'Absent')}
          disabled={anyLoading || noCredits}
          className="flex-1 bg-gradient-to-br from-[#ba1a1a] to-[#e53935] text-white py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading('absent') ? <Spinner /> : 'Absent'}
        </button>
      </div>
    );
  }

  if (cls.attendanceStatus === 'ATTEND') {
    return (
      <button disabled className="w-full bg-[#ffdfa0]/40 text-[#5c4300]/60 py-3.5 rounded-xl font-semibold text-sm cursor-not-allowed border border-[#795900]/20">
        Attended
      </button>
    );
  }

  if (cls.attendanceStatus === 'ABSENT') {
    return (
      <button disabled className="w-full bg-[#ffdad6]/40 text-[#93000a]/60 py-3.5 rounded-xl font-semibold text-sm cursor-not-allowed border border-[#ba1a1a]/20">
        Absent
      </button>
    );
  }

  if (cls.attendanceStatus === 'SKIP') {
    return (
      <button
        onClick={() => onAction(cls.classId, cls.className, 'book', 'Book Course')}
        disabled={anyLoading || noCredits}
        className="w-full bg-gradient-to-br from-[#005bbf] to-[#1a73e8] text-white py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all hover:shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading('book') ? <Spinner /> : noCredits ? 'No Credits' : 'Book Course'}
      </button>
    );
  }

  return null;
}

function Spinner() {
  return (
    <span className="flex justify-center">
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
    </span>
  );
}
