// Zustand Store for SurveyPro
// Client-side state management

import { create } from 'zustand';

export interface ProjectState {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
}

export interface DatasetState {
  id: string;
  projectId: string;
  name: string;
  crs: string;
}

interface AppState {
  // Current selection
  currentProjectId: string | null;
  currentDatasetId: string | null;
  
  // Cached data
  projects: ProjectState[];
  datasets: DatasetState[];
  
  // Actions
  setCurrentProject: (projectId: string | null) => void;
  setCurrentDataset: (datasetId: string | null) => void;
  addProject: (project: ProjectState) => void;
  addDataset: (dataset: DatasetState) => void;
  updateProject: (id: string, updates: Partial<ProjectState>) => void;
  updateDataset: (id: string, updates: Partial<DatasetState>) => void;
  removeProject: (id: string) => void;
  removeDataset: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  currentProjectId: null,
  currentDatasetId: null,
  projects: [],
  datasets: [],
  
  // Actions
  setCurrentProject: (projectId) => set({ 
    currentProjectId: projectId,
    currentDatasetId: null // Reset dataset when project changes
  }),
  
  setCurrentDataset: (datasetId) => set({ currentDatasetId: datasetId }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  
  addDataset: (dataset) => set((state) => ({
    datasets: [...state.datasets, dataset]
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  
  updateDataset: (id, updates) => set((state) => ({
    datasets: state.datasets.map((d) => 
      d.id === id ? { ...d, ...updates } : d
    )
  })),
  
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
    datasets: state.datasets.filter((d) => d.projectId !== id),
    currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
    currentDatasetId: state.currentDatasetId === id ? null : state.currentDatasetId,
  })),
  
  removeDataset: (id) => set((state) => ({
    datasets: state.datasets.filter((d) => d.id !== id),
    currentDatasetId: state.currentDatasetId === id ? null : state.currentDatasetId,
  })),
}));

export default useAppStore;
