
export interface SpatialNode {
  id: string;
  lat: number;
  lng: number;
  intensity: number;
  status: 'active' | 'syncing' | 'offline';
  label: string;
}

export interface NetworkStats {
  totalNodes: number;
  activeContributors: number;
  dataThroughput: string;
  meshStability: number;
}

export interface UserIdentity {
  publicKey: string;
  reputation: number;
  contributions: number;
  alias: string;
  rank: string;
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  NETWORK = 'network',
  IDENTITY = 'identity',
  UPLINK = 'uplink'
}
