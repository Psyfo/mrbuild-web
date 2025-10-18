'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme='light'
      className='group toaster'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-current group-[.toast]:opacity-90',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success:
            'group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 group-[.toaster]:border-green-200 [&_[data-icon]]:!text-green-600 [&_svg]:!text-green-600 [&_[data-title]]:!text-green-800 [&_.sonner-description]:!text-green-700',
          error:
            'group-[.toaster]:bg-red-50 group-[.toaster]:text-red-800 group-[.toaster]:border-red-200 [&_[data-icon]]:!text-red-600 [&_svg]:!text-red-600 [&_[data-title]]:!text-red-800 [&_.sonner-description]:!text-red-700',
          warning:
            'group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-900 group-[.toaster]:border-yellow-200 [&_[data-icon]]:!text-yellow-600 [&_svg]:!text-yellow-600 [&_[data-title]]:!text-yellow-900 [&_.sonner-description]:!text-yellow-800',
          info: 'group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-800 group-[.toaster]:border-blue-200 [&_[data-icon]]:!text-blue-600 [&_svg]:!text-blue-600 [&_[data-title]]:!text-blue-800 [&_.sonner-description]:!text-blue-700',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
