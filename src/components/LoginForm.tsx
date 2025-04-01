import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Key, Lock, User, ShieldCheck, UserPlus } from 'lucide-react';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // used only for demo (optional encryption)
  const [isProcessing, setIsProcessing] = useState(false);

  const backendUrl = 'http://localhost:3000/api';
  // Save/load private key in localStorage (demo only)
  const savePrivateKey = (username: string, privateKey: string) => {
    localStorage.setItem(`privkey-${username}`, privateKey);
  };

  const getPrivateKey = (username: string): string | null => {
    return localStorage.getItem(`privkey-${username}`);
  };

  const generateKeyPair = async (): Promise<CryptoKeyPair> => {
    return await window.crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );
  };

  const exportPrivateKey = async (key: CryptoKey): Promise<string> => {
    const exported = await window.crypto.subtle.exportKey('pkcs8', key);
    return bufferToPem(exported, 'PRIVATE KEY');
  };

  const exportPublicKey = async (key: CryptoKey): Promise<string> => {
    const exported = await window.crypto.subtle.exportKey('spki', key);
    return bufferToPem(exported, 'PUBLIC KEY');
  };

  const bufferToPem = (buffer: ArrayBuffer, label: string): string => {
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const lines = b64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
  };

  const pemToArrayBuffer = (pem: string): ArrayBuffer => {
    const b64 = pem.replace(/-----.*?-----/g, '').replace(/\s/g, '');
    const binary = atob(b64);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
    return buffer;
  };

  const handleRegister = async () => {
    if (!username) {
      toast.error('Username required to register');
      return;
    }

    try {
      setIsProcessing(true);

      const keyPair = await generateKeyPair();
      const pubPem = await exportPublicKey(keyPair.publicKey);
      const privPem = await exportPrivateKey(keyPair.privateKey);

      savePrivateKey(username, privPem);

      const res = await axios.post(`${backendUrl}/register`, { username, publicKey: pubPem });
      toast.success(res.data.message || 'Registered successfully');
    } catch (err) {
      toast.error('Registration failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      toast.error('Username is required');
      return;
    }

    const privateKeyPem = getPrivateKey(username);
    if (!privateKeyPem) {
      toast.error('No private key found. Please register first.');
      return;
    }

    try {
      setIsProcessing(true);
      const challengeRes = await axios.post(`${backendUrl}/get-challenge`, { username });
      const challenge = challengeRes.data.challenge;

      const importedKey = await window.crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(privateKeyPem),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const encoder = new TextEncoder();
      const signatureBuffer = await window.crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        importedKey,
        encoder.encode(challenge)
      );

      const signatureHex = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      console.log(signatureHex)

      const verifyRes = await axios.post(`${backendUrl}/verify-signature`, {
        username,
        signature: signatureHex,
      });

      if (verifyRes.data.message.includes('success')) {
        toast.success('Logged in successfully');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error('Login failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error during login');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Secure Access</CardTitle>
        <CardDescription className="text-center">Login with digital signature (NTRUSign simulated)</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ntru-gray" size={18} />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                disabled={isProcessing}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-ntru-primary to-ntru-secondary hover:opacity-90"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Key className="animate-spin" size={18} />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Fingerprint size={18} />
                Login with Signature
              </span>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleRegister}
            className="w-full mt-2 flex items-center gap-2 justify-center"
            disabled={isProcessing}
          >
            <UserPlus size={18} />
            Register New User
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-xs text-center text-ntru-gray">
        Private key stored locally (simulated) — replace with real NTRUSign + wallet for production
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
