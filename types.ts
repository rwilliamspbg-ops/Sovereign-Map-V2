
export interface SpatialNode {
  id: string;
  lat: number;
  lng: number;
  intensity: number;
  status: 'active' | 'syncing' | 'offline' | 'threat' | 'discovered' | 'unregistered' | 'defending' | 'cloaked' | 'quarantined';
  label: string;
  encryption: 'AES-256' | 'Quantum-Resistant' | 'P2P-Layer' | 'None';
  discoveredAt?: number;
}

export interface KineticEntity {
  id: string;
  type: 'Drone' | 'UGV' | 'Humanoid' | 'Satellite';
  status: 'Idle' | 'In-Flight' | 'Scanning' | 'Charging' | 'Emergency' | 'Defensive-Maneuver';
  battery: number;
  position: { x: number; y: number; z: number };
  target?: { x: number; y: number; z: number };
}

export interface FlightCorridor {
  id: string;
  points: { x: number; y: number; z: number }[];
  clearance: number; // 0-100% based on mesh density
}

export interface VerificationTest {
  id: string;
  name: string;
  category: 'Spatial' | 'Encryption' | 'Network' | 'Identity' | 'Beacon';
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

export interface SovereignIdentity {
  alias: string;
  worldIdVerified: boolean;
  stakedMovement: number; // $SOV earned via Proof of Movement
  reputation: number;
  hapticLinkActive: boolean;
  did: string;
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  NETWORK = 'network',
  IDENTITY = 'identity',
  UPLINK = 'uplink',
  SECURITY = 'security',
  VERIFY = 'verify',
  GOVERNANCE = 'governance',
  ATLAS = 'atlas',
  BEACON = 'beacon',
  COMMAND = 'command'
}
