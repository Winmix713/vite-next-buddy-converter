
export interface ComponentStatus {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message?: string;
  isUsed?: boolean;
}
