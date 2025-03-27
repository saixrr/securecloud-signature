
import React from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type VerificationStatus = 'verifying' | 'success' | 'failed' | null;

interface VerificationStatusProps {
  status: VerificationStatus;
  message?: string;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ 
  status, 
  message 
}) => {
  if (!status) return null;

  return (
    <div className="animate-slide-up">
      {status === 'verifying' && (
        <div className="flex items-center gap-2 text-ntru-gray">
          <Loader2 className="animate-spin" size={20} />
          <span>{message || 'Verifying signature...'}</span>
        </div>
      )}
      
      {status === 'success' && (
        <div className="flex items-center gap-2 text-ntru-success">
          <CheckCircle2 size={20} />
          <span>{message || 'Signature verified successfully!'}</span>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="flex items-center gap-2 text-ntru-error">
          <XCircle size={20} />
          <span>{message || 'Signature verification failed.'}</span>
        </div>
      )}
    </div>
  );
};

export default VerificationStatus;
