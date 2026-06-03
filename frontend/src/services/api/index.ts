// ============================================================
// VSM Platform — API Client (axios)
// ============================================================
import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  VSMProject, VSMDiagram, KPIResult, ExportFormat,
} from '../types/vsm.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

// ---- Axios instance ----
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- Auth interceptors ----
api.interceptors.request.use(config => {
  const token = localStorage.getItem('vsm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vsm_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// ---- Auth API ----
// ============================================================
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: { id: string; email: string; role: string } }>(
      '/auth/login', { email, password }
    ).then(r => r.data),

  register: (email: string, password: string, fullName: string) =>
    api.post<{ token: string }>('/auth/register', { email, password, fullName })
      .then(r => r.data),
};

// ============================================================
// ---- Project API ----
// ============================================================
export const projectApi = {
  getAll: () =>
    api.get<VSMProject[]>('/projects').then(r => r.data),

  getById: (id: string) =>
    api.get<VSMProject>(`/projects/${id}`).then(r => r.data),

  create: (data: Partial<VSMProject>) =>
    api.post<VSMProject>('/projects', data).then(r => r.data),

  update: (id: string, data: Partial<VSMProject>) =>
    api.put<VSMProject>(`/projects/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/projects/${id}`),
};

// ============================================================
// ---- Diagram API ----
// ============================================================
export const diagramApi = {
  getByProject: (projectId: string) =>
    api.get<VSMDiagram[]>(`/diagrams/project/${projectId}`).then(r => r.data),

  getById: (id: string) =>
    api.get<VSMDiagram>(`/diagrams/${id}`).then(r => r.data),

  save: (diagram: Partial<VSMDiagram>) =>
    api.post<VSMDiagram>('/diagrams', diagram).then(r => r.data),

  duplicate: (id: string, name: string) =>
    api.post<VSMDiagram>(`/diagrams/${id}/duplicate`, null, { params: { name } })
      .then(r => r.data),

  delete: (id: string) =>
    api.delete(`/diagrams/${id}`),

  // Auto-save with debounce support
  autoSave: (() => {
    let timer: ReturnType<typeof setTimeout>;
    return (diagram: VSMDiagram, delay = 2000) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        diagramApi.save(diagram).catch(console.error);
      }, delay);
    };
  })(),
};

// ============================================================
// ---- KPI API ----
// ============================================================
export const kpiApi = {
  compute: (diagramId: string) =>
    api.post<KPIResult>(`/kpi/compute/${diagramId}`).then(r => r.data),

  getHistory: (diagramId: string) =>
    api.get<KPIResult[]>(`/kpi/history/${diagramId}`).then(r => r.data),

  compare: (currentId: string, futureId: string) =>
    api.get<{
      current: KPIResult;
      future: KPIResult;
      improvements: {
        leadTimeReduction: number;
        pceGain: number;
        wipReduction: number;
      };
    }>('/kpi/compare', { params: { currentId, futureId } }).then(r => r.data),
};

// ============================================================
// ---- Simulation API ----
// ============================================================
export const simulationApi = {
  run: (diagramId: string, config: {
    durationSeconds: number;
    speedMultiplier: number;
  }) =>
    api.post(`/simulation/run/${diagramId}`, config).then(r => r.data),

  getResults: (runId: string) =>
    api.get(`/simulation/results/${runId}`).then(r => r.data),
};

// ============================================================
// ---- Export API (triggers browser download) ----
// ============================================================
export const exportApi = {
  download: async (diagramId: string, format: Exclude<ExportFormat, 'PNG' | 'SVG'>) => {
    const endpoint = format.toLowerCase(); // pdf | json | excel
    const response = await api.get(`/export/${diagramId}/${endpoint}`, {
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'] ?? '';
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    const filename = filenameMatch?.[1] ?? `vsm-${diagramId}.${endpoint}`;

    const url = URL.createObjectURL(response.data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};