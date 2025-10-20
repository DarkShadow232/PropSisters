import { toast as sonnerToast } from 'sonner';

/**
 * Unified toast notifications for consistent messaging across the app
 */
export const toast = {
  success: (message: string) => {
    sonnerToast.success(message);
  },
  
  error: (message: string) => {
    sonnerToast.error(message);
  },
  
  info: (message: string) => {
    sonnerToast.info(message);
  },
  
  warning: (message: string) => {
    sonnerToast.warning(message);
  },

  // Admin-specific messages
  admin: {
    demoMode: () => sonnerToast.success('Details updated (demo mode)', {
      description: 'Changes saved locally only',
    }),
    
    saved: () => sonnerToast.success('Details saved', {
      description: 'Changes synced to database',
    }),
    
    timeout: () => sonnerToast.error('Request timed out', {
      description: 'Please check your connection and try again',
    }),
    
    network: () => sonnerToast.error('Network error', {
      description: 'Unable to reach the server',
    }),
    
    validation: (field: string) => sonnerToast.error('Validation error', {
      description: `${field} contains invalid data`,
    }),
  },
};

export type ToastType = typeof toast;

