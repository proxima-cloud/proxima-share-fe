"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, LogIn } from 'lucide-react';
import GoogleLogin from './GoogleLogin';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  onOpenRegister?: () => void;
}

export default function LoginForm({ onSuccess, redirectTo = '/dashboard', onOpenRegister }: LoginFormProps) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.username, formData.password);
      
      if (success) {
        toast({
          title: t('auth.login.success.title'),
          description: t('auth.login.success.description'),
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      } else {
        setError(t('auth.login.error.invalidCredentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('auth.login.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t('auth.login.title')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('auth.login.description')}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">{t('auth.username')}</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={t('auth.usernamePlaceholder')}
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordPlaceholder')}
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.login.loggingIn')}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {t('auth.login.button')}
              </>
            )}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.google.or')}
              </span>
            </div>
          </div>
          
          <GoogleLogin onSuccess={onSuccess} redirectTo={redirectTo} />
          
          <div className="text-center text-sm text-muted-foreground">
            {t('auth.login.noAccount')}{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => {
                if (onOpenRegister) {
                  onOpenRegister();
                } else {
                  router.push('/register');
                }
              }}
              disabled={isLoading}
            >
              {t('auth.login.registerLink')}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
