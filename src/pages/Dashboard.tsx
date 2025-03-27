
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Lock, ShieldCheck, FileText, LogOut, User, Server, Activity, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import EncryptionPanel from '@/components/EncryptionPanel';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    toast.success('Welcome to SecureCloud', {
      description: 'Authentication successful via NTRU digital signature'
    });
  }, []);

  const handleLogout = () => {
    toast.info('Logging out...', {
      description: 'Session terminated securely'
    });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      
      <header className="p-4 border-b bg-white bg-opacity-80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Logo size="medium" />
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 border-ntru-primary">
                <ShieldCheck size={14} className="text-ntru-primary" />
                <span className="text-ntru-primary">Secure Session</span>
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <User size={14} />
                <span>demo_user</span>
              </Badge>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="gap-1 text-ntru-gray hover:text-ntru-dark hover:bg-ntru-accent"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="animate-slide-up mb-6">
          <h1 className="text-3xl font-bold text-ntru-dark">Secure Cloud Dashboard</h1>
          <p className="text-ntru-gray mt-1">
            Manage your secure cloud environment with NTRU cryptographic protection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="glass-card animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-ntru-gray">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xl">Active</span>
                <Activity size={20} className="text-ntru-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-ntru-gray">Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xl">Secure Cloud</span>
                <Server size={20} className="text-ntru-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-ntru-gray">Signature Algorithm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xl">NTRUSign</span>
                <Key size={20} className="text-ntru-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-ntru-gray">Security Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xl">High</span>
                <ShieldCheck size={20} className="text-ntru-success" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="encryption" className="animate-slide-up">
          <TabsList className="mb-6">
            <TabsTrigger value="encryption" className="gap-2">
              <Lock size={16} />
              <span>Encryption Tools</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-2">
              <FileText size={16} />
              <span>Secure Files</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="encryption" className="space-y-6">
            <EncryptionPanel />
            
            <Card className="glass-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="text-ntru-primary" size={20} />
                  Security Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">NTRU Encryption</h3>
                  <p className="text-sm text-ntru-gray">
                    NTRU is a lattice-based cryptographic system that provides quantum-resistant encryption, 
                    making it suitable for protecting data against attacks from quantum computers.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">HMAC-DRBG</h3>
                  <p className="text-sm text-ntru-gray">
                    HMAC-DRBG (Hash-based Message Authentication Code Deterministic Random Bit Generator) 
                    is a secure random number generation algorithm used in the digital signature process.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">NTRUSign</h3>
                  <p className="text-sm text-ntru-gray">
                    NTRUSign is a digital signature algorithm based on the NTRU lattice problem, 
                    providing post-quantum security for authentication and verification processes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files">
            <Card className="glass-card h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 text-ntru-gray opacity-50" />
                <h3 className="text-xl font-medium mb-2">No Files Yet</h3>
                <p className="text-ntru-gray mb-4">Upload files to encrypt and store them securely</p>
                <Button className="bg-ntru-primary hover:bg-ntru-secondary transition-colors">
                  Upload Files
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-4 px-6 border-t bg-white bg-opacity-80 backdrop-blur-sm mt-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm text-ntru-gray">
            <p>© 2023 SecureCloud. All rights reserved.</p>
          </div>
          <div className="text-sm text-ntru-gray">
            Powered by NTRU Cryptographic Algorithms
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
