import React from 'react';
import { PasswordRequirement } from '@/lib/validation';

interface PasswordRequirementsProps {
  requirements: PasswordRequirement[];
  show: boolean;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  requirements,
  show,
}) => {
  if (!show) return null;

  return (
    <div className='space-y-1.5 slide-in-from-top-2 mt-2 animate-in duration-200'>
      {requirements.map((req) => (
        <div
          key={req.id}
          className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
            req.met
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {req.met ? (
            <svg
              className='flex-shrink-0 w-4 h-4'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          ) : (
            <svg
              className='flex-shrink-0 w-4 h-4'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
          )}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
};
