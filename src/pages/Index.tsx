
import React from 'react';
import Logo from '@/components/Logo';
import LoginForm from '@/components/LoginForm';
import AnimatedBackground from '@/components/AnimatedBackground';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      
      <header className="py-6 px-8">
        <Logo size="large" />
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-4xl font-bold text-ntru-dark leading-tight">
              Secure Cloud Environment with NTRU Cryptography
            </h1>
            
            <p className="text-ntru-gray text-lg">
              Experience next-generation security with our NTRU variant cryptographic algorithms, 
              designed to protect your cloud data with quantum-resistant encryption.
            </p>
            
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-ntru-accent p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ntru-primary">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ntru-dark">HMAC-DRBG Authentication</h3>
                  <p className="text-sm text-ntru-gray">Secure random bit generation for robust digital signatures</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-ntru-accent p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ntru-primary">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ntru-dark">NTRUSign Verification</h3>
                  <p className="text-sm text-ntru-gray">Quantum-resistant digital signature algorithm</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-ntru-accent p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ntru-primary">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ntru-dark">NTRU Encryption</h3>
                  <p className="text-sm text-ntru-gray">Advanced lattice-based encryption for your sensitive data</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-8 text-center text-sm text-ntru-gray">
        <p>Protected by advanced NTRU variant cryptographic algorithms</p>
      </footer>
    </div>
  );
};

export default Index;
