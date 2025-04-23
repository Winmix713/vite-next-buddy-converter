
export interface ComponentStatus {
  name: string;
  status: 'ok' | 'error';
  message?: string;
  isUsed?: boolean;
}
