export default function LoadingSpinner() {
  return (
    <div className='flex justify-center items-center bg-gray-50 min-h-screen'>
      <div className='text-center'>
        <div className='mx-auto border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin'></div>
        <p className='mt-4 text-gray-600'>Loading...</p>
      </div>
    </div>
  );
}
