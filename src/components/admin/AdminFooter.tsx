/**
 * Admin Footer Component
 * Reusable footer for all admin pages
 */

export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white mt-auto border-gray-200 border-t'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl'>
        <div className='flex md:flex-row flex-col justify-between items-center gap-4'>
          {/* Left side - Branding */}
          <div className='md:text-left text-center'>
            <p className='font-semibold text-gray-900 text-sm'>
              Mr Build Admin Portal
            </p>
            <p className='text-gray-600 text-xs'>
              Building materials supplier management system
            </p>
          </div>

          {/* Center - Quick Links */}
          <div className='flex flex-wrap justify-center gap-4 text-sm'>
            <a
              href='/admin'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Dashboard
            </a>
            <span className='text-gray-300'>|</span>
            <a
              href='/admin/contacts'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Contacts
            </a>
            <span className='text-gray-300'>|</span>
            <a
              href='mailto:support@mrbuild.com'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Support
            </a>
          </div>

          {/* Right side - Copyright */}
          <div className='text-center md:text-right'>
            <p className='text-gray-600 text-xs'>
              &copy; {currentYear} Mr Build. All rights reserved.
            </p>
            <p className='text-gray-500 text-xs'>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
