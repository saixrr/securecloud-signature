
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole, UnlockKeyhole, FileUp, Check, RefreshCw } from 'lucide-react';
import { encryptData, decryptData } from '@/utils/cryptoUtils';
import { toast } from 'sonner';

const EncryptionPanel: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const handleProcess = async () => {
    if (!inputText) {
      toast.error('Please enter text to process');
      return;
    }

    setIsProcessing(true);
    
    try {
      if (mode === 'encrypt') {
        const encrypted = await encryptData(inputText);
        setOutputText(encrypted);
        toast.success('Data encrypted successfully using NTRU encryption');
      } else {
        const decrypted = await decryptData(inputText);
        setOutputText(decrypted);
        toast.success('Data decrypted successfully using NTRU decryption');
      }
    } catch (error) {
      toast.error(`Failed to ${mode} data`);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModeToggle = () => {
    setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
    setInputText('');
    setOutputText('');
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === 'encrypt' ? (
            <>
              <LockKeyhole className="text-ntru-primary" size={20} />
              NTRU Encryption
            </>
          ) : (
            <>
              <UnlockKeyhole className="text-ntru-secondary" size={20} />
              NTRU Decryption
            </>
          )}
        </CardTitle>
        <CardDescription>
          {mode === 'encrypt' 
            ? 'Securely encrypt your data using NTRU algorithm' 
            : 'Decrypt NTRU encrypted data'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {mode === 'encrypt' ? 'Data to Encrypt' : 'Data to Decrypt'}
          </label>
          <Textarea
            placeholder={mode === 'encrypt' 
              ? 'Enter the text you want to encrypt...' 
              : 'Enter encrypted text to decrypt...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            className="resize-none font-mono text-sm"
          />
        </div>
        
        {outputText && (
          <div className="space-y-2 animate-slide-up">
            <label className="text-sm font-medium">
              {mode === 'encrypt' ? 'Encrypted Output' : 'Decrypted Output'}
            </label>
            <div className="bg-ntru-accent bg-opacity-40 p-3 rounded-md font-mono text-sm break-all max-h-40 overflow-y-auto">
              {outputText}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between gap-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleModeToggle}
            className="border-ntru-primary text-ntru-primary hover:bg-ntru-primary hover:text-white"
          >
            {mode === 'encrypt' ? 'Switch to Decrypt' : 'Switch to Encrypt'}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-ntru-gray"
            disabled={!inputText && !outputText}
          >
            <RefreshCw size={16} className="mr-1" /> Reset
          </Button>
        </div>
        
        <Button
          onClick={handleProcess}
          className="bg-gradient-to-r from-ntru-primary to-ntru-secondary hover:opacity-90 transition-all"
          disabled={!inputText || isProcessing}
        >
          {isProcessing ? (
            <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : mode === 'encrypt' ? (
            <><LockKeyhole className="mr-2 h-4 w-4" /> Encrypt</>
          ) : (
            <><UnlockKeyhole className="mr-2 h-4 w-4" /> Decrypt</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EncryptionPanel;
