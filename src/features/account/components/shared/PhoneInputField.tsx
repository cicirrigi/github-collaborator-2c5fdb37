/**
 * 📞 Phone Input Field - International Phone Number Input
 *
 * Component pentru input telefon cu country picker și format E.164
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import { Phone } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Use local flags from public/flags/

interface PhoneInputFieldProps {
  readonly label: string;
  readonly value: string;
  readonly placeholder: string;
  readonly isEditing: boolean;
  readonly readOnly?: boolean;
  readonly helperText?: string;
  readonly onChange?: (value: string) => void;
}

export function PhoneInputField({
  label,
  value,
  placeholder,
  isEditing,
  readOnly = false,
  helperText,
  onChange,
}: PhoneInputFieldProps) {
  return (
    <div>
      <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
        {label}
      </label>

      <div className='relative'>
        <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
          <Phone className='w-4 h-4 text-neutral-400' />
        </div>

        {isEditing && !readOnly ? (
          <div className='relative w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50'>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry='RO'
              value={value}
              onChange={val => onChange?.(val || '')}
              placeholder={placeholder}
              className='phone-input-clean'
              flagComponent={({ country, countryName }) => {
                const code = (country || 'RO').toUpperCase();
                return (
                  <img
                    src={`/flags/${code}.svg`}
                    alt={`${countryName || code} flag`}
                    className='phone-flag-image'
                    loading='lazy'
                    onError={e => {
                      // Fallback to UNKNOWN flag if country flag doesn't exist
                      (e.currentTarget as HTMLImageElement).src = '/flags/UNKNOWN.svg';
                    }}
                  />
                );
              }}
            />
          </div>
        ) : (
          <div className='w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white'>
            {value || <span className='text-neutral-400'>Not provided</span>}
          </div>
        )}
      </div>

      {helperText && (
        <p className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>{helperText}</p>
      )}

      <style jsx global>{`
        .phone-input-clean {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
        }

        .phone-input-clean .PhoneInputInput {
          width: 100%;
          padding: 0 0 0 30px;
          border: none;
          background: transparent;
          color: inherit;
          font-size: 14px;
          outline: none;
          height: auto;
        }

        .phone-input-clean .PhoneInputInput:focus {
          outline: none;
          border: none;
          box-shadow: none;
        }

        .phone-input-clean .PhoneInputInput::placeholder {
          color: rgb(107 114 128);
        }

        .phone-input-clean .PhoneInputCountrySelect {
          position: absolute;
          left: 2px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          padding: 4px;
          margin: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          height: 24px;
          overflow: visible;
          z-index: 20;
        }

        .phone-input-clean .PhoneInputCountryIcon,
        .phone-flag-image {
          width: 20px;
          height: 15px;
          margin-right: 6px;
          border-radius: 2px;
          object-fit: cover;
          display: block;
          flex-shrink: 0;
        }

        .phone-input-clean .PhoneInputCountrySelectArrow {
          width: 8px;
          height: 8px;
          margin-left: 2px;
          color: rgb(107 114 128);
        }

        /* Dark mode */
        .dark .phone-input-clean .PhoneInputInput::placeholder {
          color: rgb(156 163 175);
        }

        .dark .phone-input-clean .PhoneInputCountrySelectArrow {
          color: rgb(156 163 175);
        }
      `}</style>
    </div>
  );
}
