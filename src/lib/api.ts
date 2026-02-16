/**
 * API Service Layer
 * Abstracts all data operations — works with Express server when deployed,
 * falls back to localStorage in development/preview mode.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

// Detect if running against local Express server
const isServerMode = !!API_BASE;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!isServerMode) {
    throw new Error('Server not available — using localStorage fallback');
  }
  const res = await fetch(`${API_BASE}/api${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// Generic CRUD for any resource
function createResource<T>(resource: string) {
  return {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ data: T[]; total: number }>(`/${resource}${qs}`);
    },
    getById: (id: number | string) => request<T>(`/${resource}/${id}`),
    create: (data: Partial<T>) => request<T>(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number | string, data: Partial<T>) => request<T>(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number | string) => request<{ success: boolean }>(`/${resource}/${id}`, {
      method: 'DELETE',
    }),
  };
}

// Typed API resources
export const api = {
  students: createResource('students'),
  classes: createResource('classes'),
  parents: createResource('parents'),
  staff: createResource('staff'),
  subjects: createResource('subjects'),
  attendance: createResource('attendance'),
  exams: createResource('exams'),
  examResults: createResource('exam-results'),
  feeStructures: createResource('fee-structures'),
  feePayments: createResource('fee-payments'),
  discipline: createResource('discipline'),
  gateLog: createResource('gate-log'),
  visitors: createResource('visitors'),
  payroll: createResource('payroll'),
  transactions: createResource('transactions'),
  requisitions: createResource('requisitions'),
  assets: createResource('assets'),
  letters: createResource('letters'),
  calendarEvents: createResource('calendar-events'),
  timetable: createResource('timetable'),
  ecdProgress: createResource('ecd-progress'),

  // Settings
  settings: {
    get: () => request<Record<string, any>>('/settings'),
    update: (data: Record<string, any>) => request<{ success: boolean }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Dashboard
  dashboard: {
    getStats: () => request<{
      totalStudents: number;
      totalStaff: number;
      totalClasses: number;
      todayAttendance: number;
      totalFees: number;
      pendingRequisitions: number;
    }>('/dashboard/stats'),
  },

  // Reports
  reports: {
    attendanceSummary: (params: Record<string, string>) => {
      const qs = '?' + new URLSearchParams(params).toString();
      return request<any[]>(`/reports/attendance-summary${qs}`);
    },
    feeBalance: () => request<any[]>('/reports/fee-balance'),
  },

  // Utility
  isServerMode: () => isServerMode,
};

export default api;
