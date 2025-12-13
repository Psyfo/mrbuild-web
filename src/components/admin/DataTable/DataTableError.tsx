import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DataTableErrorProps {
  error: Error | string;
  onRetry?: () => void;
}

export function DataTableError({ error, onRetry }: DataTableErrorProps) {
  const errorMessage =
    typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <Alert variant='destructive' className='mt-4'>
      <AlertCircle className='w-4 h-4' />
      <AlertTitle>Error loading data</AlertTitle>
      <AlertDescription className='flex justify-between items-center'>
        <span>{errorMessage}</span>
        {onRetry && (
          <Button
            variant='outline'
            size='sm'
            onClick={onRetry}
            className='ml-4'
          >
            <RefreshCw className='mr-2 w-4 h-4' />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
