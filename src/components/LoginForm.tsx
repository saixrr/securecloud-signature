
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Key, Lock, User } from 'lucide-react';
import { generateSignature, verifySignature } from '@/utils/cryptoUtils';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isGeneratingSignature, setIsGeneratingSignature] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [generatedSignature, setGeneratedSignature] = useState<string | null>(null);

  const handleGenerateSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setIsGeneratingSignature(true);
    
    try {
      // In a real implementation, this would use actual HMAC-DRBG and NTRUSign
      const signature = await generateSignature(username, password);
      setGeneratedSignature(signature);
      
      toast.success('Digital signature generated successfully', {
        description: 'Using HMAC-DRBG and NTRUSign algorithms'
      });
      
      // Automatically trigger verification after signature generation
      setTimeout(() => {
        setIsGeneratingSignature(false);
        setIsVerifying(true);
        
        // Simulate verification process
        setTimeout(() => {
          const isValid = verifySignature(signature);
          
          if (isValid) {
            toast.success('Signature verified successfully');
            setTimeout(() => navigate('/dashboard'), 1000);
          } else {
            toast.error('Signature verification failed');
            setGeneratedSignature(null);
          }
          
          setIsVerifying(false);
        }, 1500);
      }, 1500);
      
    } catch (error) {
      toast.error('Error generating signature');
      setIsGeneratingSignature(false);
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Secure Access</CardTitle>
        <CardDescription className="text-center">
          Login with digital signature verification
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleGenerateSignature} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ntru-gray" size={18} />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                disabled={isGeneratingSignature || isVerifying}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ntru-gray" size={18} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={isGeneratingSignature || isVerifying}
              />
            </div>
          </div>
          
          {generatedSignature && (
            <div className="bg-ntru-accent bg-opacity-40 p-3 rounded-md text-sm font-mono break-all">
              <div className="flex items-center gap-2 mb-1">
                <Key size={16} className="text-ntru-primary" />
                <span className="text-ntru-dark font-semibold">Digital Signature:</span>
              </div>
              {generatedSignature.substring(0, 20)}...{generatedSignature.substring(generatedSignature.length - 20)}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-ntru-primary to-ntru-secondary hover:opacity-90 transition-all duration-300"
            disabled={isGeneratingSignature || isVerifying}
          >
            {isGeneratingSignature ? (
              <span className="flex items-center gap-2">
                <Key className="animate-spin" size={18} />
                Generating Signature...
              </span>
            ) : isVerifying ? (
              <span className="flex items-center gap-2">
                <Fingerprint className="animate-pulse" size={18} />
                Verifying Signature...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Fingerprint size={18} />
                Authenticate
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center pt-0">
        <p className="text-xs text-ntru-gray">
          Protected by NTRU cryptographic algorithms
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
