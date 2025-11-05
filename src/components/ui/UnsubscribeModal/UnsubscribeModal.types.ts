/**
 * 📧 UnsubscribeModal Component Types
 * Type definitions for unsubscribe modal component
 */

export interface UnsubscribeModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Function to close the modal */
  onClose: () => void;
  
  /** Function to handle unsubscribe confirmation */
  onConfirm?: (email?: string) => void | Promise<void>;
  
  /** Custom title for the modal */
  title?: string;
  
  /** Custom description */
  description?: string;
  
  /** Whether to show email input */
  showEmailInput?: boolean;
  
  /** Loading state during unsubscribe */
  isLoading?: boolean;
  
  /** Success state after unsubscribe */
  isSuccess?: boolean;
  
  /** Error message */
  error?: string;
  
  /** Custom className */
  className?: string;
}

export type UnsubscribeState = 'idle' | 'loading' | 'success' | 'error';
