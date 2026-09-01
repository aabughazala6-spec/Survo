import Dexie, { Table } from 'dexie';

// Type definitions for Multi-Dataset Schema (Law 7)

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived';
}

export interface Dataset {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  crs: string; // Coordinate Reference System
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface Point {
  id: string;
  datasetId: string;
  name: string;
  northing: number;
  easting: number;
  elevation?: number;
  code?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  attributes?: Record<string, unknown>;
}

export interface Task {
  id: string;
  projectId: string;
  datasetId?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Dexie Database Schema
export class SurveyProDB extends Dexie {
  projects!: Table<Project, string>;
  datasets!: Table<Dataset, string>;
  points!: Table<Point, string>;
  tasks!: Table<Task, string>;

  constructor() {
    super('SurveyProDB');
    
    this.version(1).stores({
      // Projects table
      projects: 'id, name, status, createdAt, updatedAt',
      
      // Datasets table - multiple per project (Law 7: Multi-Dataset is MVP)
      datasets: 'id, projectId, name, createdAt, updatedAt',
      
      // Points table - linked to datasetId
      points: 'id, datasetId, name, createdAt, updatedAt',
      
      // Tasks table - linked to projectId, optionally to datasetId
      tasks: 'id, projectId, datasetId, status, priority, createdAt, updatedAt',
    });
  }
}

// Singleton instance
export const db = new SurveyProDB();

export default db;
