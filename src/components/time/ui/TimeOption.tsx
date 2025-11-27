/**
 * 🕒 VANTAGE LANE — TimeOption
 * A single clickable time slot (ex: "14:30").
 * No styling, only data-attributes for premium theming later.
 */

import type { TimeOptionProps } from '../core/time-types';
import { formatTimeValue } from '../core/time-utils';

export function TimeOption({
  time,
  isSelected,
  isDisabled,
  onSelect,
  className = '',
}: TimeOptionProps) {
  const handleClick = () => {
    if (isDisabled) return;
    onSelect(time);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      data-selected={isSelected ? 'true' : 'false'}
      data-disabled={isDisabled ? 'true' : 'false'}
      className={className}
    >
      {formatTimeValue(time)}
    </button>
  );
}
