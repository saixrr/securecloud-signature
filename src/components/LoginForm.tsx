// // Falcon-based Login & Register Flow
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Key, User, UserPlus } from 'lucide-react';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [falcon, setFalcon] = useState<any>(null);
  const backendUrl = 'http://localhost:3000/api';

  useEffect(() => {
    const loadFalcon = async () => {
      const script = document.createElement('script');
      script.src = '/falcon/falcon.js';
      script.async = true;
  
      script.onload = async () => {
        // @ts-ignore
        const createFalconModule = window.createFalconModule;
        const instance = await createFalconModule();
  
        const init = instance.cwrap('init', null, []);
        const generateKeypair = instance.cwrap('generate_keypair', 'number', []);
        const getPublicKey = instance.cwrap('get_public_key', 'number', []);
        const getPrivateKey = instance.cwrap('get_private_key', 'number', []);
        const signMessage = instance.cwrap('sign_message', 'number', [
          'number', 'number', 'number', 'number',
        ]);
  
        init();
        setFalcon({ instance, generateKeypair, getPublicKey, getPrivateKey, signMessage });
      };
  
      document.body.appendChild(script);
    };
  
    loadFalcon();
  }, []);
  

  const handleRegister = async () => {
   
    if (!username || !falcon) return toast.error('Username required and Falcon module not ready');
    try {
      setIsProcessing(true);
      const start = performance.now()
      
      falcon.generateKeypair();
      const end = performance.now();
      console.log(`🕒 Falcon Keypair Generation: ${(end - start).toFixed(2)} ms`);
      const pubPtr = falcon.getPublicKey();
      const pubKey = new Uint8Array(falcon.instance.HEAPU8.buffer, pubPtr, 897); // Falcon-512 pub size
      const privPtr = falcon.getPrivateKey();
      const privKey = new Uint8Array(falcon.instance.HEAPU8.buffer, privPtr, 1281);
      localStorage.setItem(`falcon-privkey-${username}`, JSON.stringify(Array.from(privKey)));
      await axios.post(`${backendUrl}/register`, {
        username,
        publicKey: btoa(String.fromCharCode(...pubKey))
      });
      

      toast.success('User registered with Falcon');
    } catch (err) {
      console.log(err)
      toast.error('Registration failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !falcon) return toast.error('Username required and Falcon module not ready');

    const privStr = localStorage.getItem(`falcon-privkey-${username}`);
    if (!privStr) return toast.error('No private key found. Please register.');

    try {
      setIsProcessing(true);
      const challengeRes = await axios.post(`${backendUrl}/get-challenge`, { username });
      const challenge = challengeRes.data.challenge;

      const msg = new TextEncoder().encode(challenge);
      const privPtr = falcon.getPrivateKey();
      const signaturePtr = falcon.instance._malloc(1280);
const sigLenPtr = falcon.instance._malloc(4);


      // Write private key back to memory
      const privKey = new Uint8Array(JSON.parse(privStr));
      falcon.instance.HEAPU8.set(privKey, privPtr);

      const msgPtr = falcon.instance._malloc(msg.length);
falcon.instance.HEAPU8.set(msg, msgPtr); // Copy message into WASM memory
const signStart = performance.now();

falcon.signMessage(signaturePtr, sigLenPtr, msgPtr, msg.length);
const signEnd = performance.now();
console.log(`🕒 Falcon Signature Time: ${(signEnd - signStart).toFixed(2)} ms`);


      const sigLen = falcon.instance.getValue(sigLenPtr, 'i32');
      const signature = new Uint8Array(falcon.instance.HEAPU8.buffer, signaturePtr, sigLen);

      await axios.post(`${backendUrl}/verify-signature`, {
        username,
        signature: btoa(String.fromCharCode(...signature)),
      });
      

      toast.success('Logged in via Falcon signature');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      console.log(err.message)
      toast.error(err.response?.data?.message || 'Login error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Secure Falcon Access</CardTitle>
        <CardDescription className="text-center">Login with Falcon Post-Quantum Signatures</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Key className="animate-spin" size={18} /> Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Fingerprint size={18} /> Login with Falcon
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
            <UserPlus size={18} /> Register New User
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-xs text-center text-ntru-gray">
        Falcon-512 PQ Signature | Private key stored locally
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
