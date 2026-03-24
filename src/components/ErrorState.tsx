import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'त्रुटि भयो',
  message = 'समाचार लोड गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।',
  onRetry,
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
        <FaExclamationTriangle className="w-12 h-12 text-red-500 dark:text-red-400" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <FaRedo className="w-4 h-4" />
          पुनः प्रयास गर्नुहोस्
        </button>
      )}
    </div>
  );
}

// Specific error state for network errors
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="नेटवर्क जडान समस्या"
      message="इन्टरनेट जडान जाँच गर्नुहोस् र पुनः प्रयास गर्नुहोस्।"
      onRetry={onRetry}
    />
  );
}

// Specific error state for not found
export function NotFoundState({ 
  resource = 'समाचार',
  onRetry 
}: { 
  resource?: string;
  onRetry?: () => void;
}) {
  return (
    <ErrorState
      title={`${resource} भेटिएन`}
      message={`तपाईंले खोज्नुभएको ${resource} भेटिएन।`}
      onRetry={onRetry}
    />
  );
}