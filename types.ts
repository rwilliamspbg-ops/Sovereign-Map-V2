
export interface SpatialNode {
  id: string;
  lat: number;
  lng: number;
  intensity: number;
  status: 'active' | 'syncing' | 'offline' | 'threat';
  label: string;
  encryption: 'AES-256' | 'Quantum-Resistant' | 'P2P-Layer';
}

export interface VerificationTest {
  id: string;
  name: string;
  category: 'Spatial' | 'Encryption' | 'Network' | 'Identity';
  status: 'idle' | 'running' | 'passed' | 'failed';
  result?: string;
  lastRun?: string;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  status: 'Proposed' | 'Active' | 'Executed';
  impact: 'Critical' | 'Optimization' | 'Maintenance';
  votes: number;
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  NETWORK = 'network',
  IDENTITY = 'identity',
  UPLINK = 'uplink',
  SECURITY = 'security',
  VERIFY = 'verify',
  GOVERNANCE = 'governance',
  ATLAS = 'atlas'
}
