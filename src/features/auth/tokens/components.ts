/**
 * 🧩 Auth Components Tokens - Vantage Lane 2.0
 *
 * Buttons, inputs, fields, tabs și alte componente UI
 * Modular și tree-shakeable
 */

export const authComponentTokens = {
  /**
   * Form Fields
   */
  input: {
    /**
     * Input Styling - Modern Glass Design
     */
    base: 'transition-all duration-300',
    default:
      'w-full px-4 py-3 rounded-lg text-neutral-900 dark:text-white text-sm bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 placeholder:text-neutral-500 dark:placeholder:text-neutral-600 border-2 border-transparent',
    focus: 'focus:border-[var(--brand-primary)] focus:border-2',
    error: 'shadow-[0_0_0_2px_rgba(239,68,68,0.4)]',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },

  /**
   * Checkbox
   */
  checkbox: {
    container: 'flex items-start gap-3',
    input: `mt-0.5 w-4 h-4 rounded appearance-none focus:ring-0 focus:outline-none 
       bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 
       dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 
       border border-neutral-300 dark:border-neutral-700 
       checked:bg-[var(--brand-primary)] checked:border-[var(--brand-primary)] 
       checked:bg-[url('data:image/svg+xml,%3csvg%20viewBox%3d%270%200%2016%2016%27%20fill%3d%27white%27%20xmlns%3d%27http%3a//www.w3.org/2000/svg%27%3e%3cpath%20d%3d%27m13.854%203.646-8%208-.5.5-.5-.5-4-4%201.414-1.414L5.5%209.793l7.146-7.147z%27/%3e%3c/svg%3e')] 
       focus:shadow-[inset_0_1px_0_var(--brand-primary)/20,0_0_0_2px_var(--brand-primary)/30] 
       cursor-pointer transition-all duration-200`,
    label: 'text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed cursor-pointer',
  },

  /**
   * Buttons
   */
  button: {
    primary: {
      base: 'w-full py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[var(--brand-primary)]/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:ring-offset-2 focus:ring-offset-transparent',
      background: 'bg-[var(--brand-primary)]',
      text: 'text-[var(--background-dark)]',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
      loading: 'flex items-center justify-center gap-2',
    },
    social: {
      base: 'w-full text-center py-2.5 px-5 text-sm rounded-lg bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border-2 border-t-neutral-700/40 border-l-neutral-700/40 border-b-neutral-800 border-r-neutral-800 dark:border-t-white/5 dark:border-l-white/5 dark:border-b-black dark:border-r-black shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] text-neutral-900 dark:text-white font-medium transition-colors duration-200 hover:bg-opacity-90 auth-focus-ring flex items-center justify-center gap-3',
      hover: 'hover:from-neutral-100/95 hover:via-neutral-150/90 hover:to-neutral-100/95',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    },
  },

  /**
   * Success/Error Messages
   */
  message: {
    success:
      'p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm',
    error:
      'p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm',
    info: 'p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm',
  },

  /**
   * Divider
   */
  divider: {
    container: 'flex items-center gap-4 my-6',
    line: 'flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent',
    text: 'text-sm text-neutral-500 dark:text-neutral-400 font-medium px-4 select-none',
  },

  /**
   * Actions (Remember me, Forgot password row)
   */
  actions: {
    container: 'flex items-center justify-between mb-6',
    forgotPassword:
      'text-sm font-medium text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 rounded-sm px-1 py-0.5',
  },

  /**
   * Social Providers
   */
  social: {
    container: 'space-y-3',
  },
} as const;
