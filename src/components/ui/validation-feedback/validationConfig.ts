import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export const validationConfig = {
  error: {
    icon: AlertTriangle,
    title: 'Please fix the following issues:',
    role: 'alert',
    ariaLive: 'assertive' as const,
    colors: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800/50',
      text: {
        title: 'text-red-900 dark:text-red-200',
        message: 'text-red-800 dark:text-red-300/90',
        icon: 'text-red-600 dark:text-red-300',
        button: 'text-red-700 dark:text-red-200',
      },
      dot: 'bg-red-500 dark:bg-red-400',
      hover: 'hover:bg-red-50/20 dark:hover:bg-red-900/30',
    },
  },
  warning: {
    icon: AlertCircle,
    title: 'Please review the following recommendations:',
    role: 'status',
    ariaLive: 'polite' as const,
    colors: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800/50',
      text: {
        title: 'text-amber-900 dark:text-amber-100',
        message: 'text-amber-800 dark:text-amber-200/90',
        icon: 'text-amber-600 dark:text-amber-300',
        button: 'text-amber-700 dark:text-amber-200',
      },
      dot: 'bg-amber-500 dark:bg-amber-400',
      hover: 'hover:bg-amber-50/30 dark:hover:bg-amber-900/30',
    },
  },
  success: {
    icon: CheckCircle,
    title: 'Everything looks great!',
    role: 'status',
    ariaLive: 'polite' as const,
    colors: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      text: {
        title: 'text-emerald-900 dark:text-emerald-100',
        message: 'text-emerald-800 dark:text-emerald-200/90',
        icon: 'text-emerald-600 dark:text-emerald-300',
        button: 'text-emerald-700 dark:text-emerald-200',
      },
      dot: 'bg-emerald-500 dark:bg-emerald-400',
      hover: 'hover:bg-emerald-50/30 dark:hover:bg-emerald-900/30',
    },
  },
};
