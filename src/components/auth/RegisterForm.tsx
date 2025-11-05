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
import { Loader2, Eye, EyeOff, UserPlus, Check } from 'lucide-react';
import GoogleLogin from './GoogleLogin';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  onOpenLogin?: () => void;
}

export default function RegisterForm({ onSuccess, redirectTo = '/dashboard', onOpenLogin }: RegisterFormProps) {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate email
    if (!isValidEmail(formData.email)) {
      setError(t('auth.register.error.invalidEmail'));
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.error.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError(t('auth.register.error.weakPassword'));
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData.username, formData.password, ['ROLE_USER'], formData.email);
      
      if (result.success) {
        toast({
          title: t('auth.register.success.title'),
          description: t('auth.register.success.description'),
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      } else {
        setError(result.error || t('auth.register.error.generic'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(t('auth.register.error.generic'));
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
    
    // Validate email when email field changes
    if (name === 'email') {
      if (value && !isValidEmail(value)) {
        setEmailError(t('auth.register.error.invalidEmail'));
      } else {
        setEmailError('');
      }
    }
    
    // Validate password when password field changes
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t('auth.register.title')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('auth.register.description')}
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
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="email"
              className={emailError ? 'border-red-500' : ''}
            />
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
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
                autoComplete="new-password"
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
            
            {/* Password validation indicators */}
            {formData.password && (
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <Check className={`h-3 w-3 ${passwordValidation.length ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.length ? 'text-green-500' : 'text-gray-400'}>
                    {t('auth.register.passwordRequirements.length')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className={`h-3 w-3 ${passwordValidation.uppercase ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.uppercase ? 'text-green-500' : 'text-gray-400'}>
                    {t('auth.register.passwordRequirements.uppercase')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className={`h-3 w-3 ${passwordValidation.lowercase ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.lowercase ? 'text-green-500' : 'text-gray-400'}>
                    {t('auth.register.passwordRequirements.lowercase')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className={`h-3 w-3 ${passwordValidation.number ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.number ? 'text-green-500' : 'text-gray-400'}>
                    {t('auth.register.passwordRequirements.number')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className={`h-3 w-3 ${passwordValidation.special ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.special ? 'text-green-500' : 'text-gray-400'}>
                    {t('auth.register.passwordRequirements.special')}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Password match indicator */}
            {formData.confirmPassword && (
              <div className="flex items-center gap-2 text-xs">
                <Check className={`h-3 w-3 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`} />
                <span className={passwordsMatch ? 'text-green-500' : 'text-red-500'}>
                  {passwordsMatch ? t('auth.register.passwordsMatch') : t('auth.register.passwordsDoNotMatch')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.register.creating')}
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                {t('auth.register.button')}
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
            {t('auth.register.haveAccount')}{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => {
                if (onOpenLogin) {
                  onOpenLogin();
                } else {
                  router.push('/login');
                }
              }}
              disabled={isLoading}
            >
              {t('auth.register.loginLink')}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
