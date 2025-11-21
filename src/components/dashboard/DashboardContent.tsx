"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, FileText, Upload, Download, Calendar, Clock, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface UserFile {
  uuid: string;
  filename: string;
  size: number;
  uploadDate: string;
  expiryDate: string;
  downloadCount: number;
  ownerUsername: string | null;
  public: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
  console.error('NEXT_PUBLIC_API_BASE_URL is not set in environment variables');
}

export function DashboardContent() {
  const { user, logout, token } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchUserFiles = useCallback(async () => {
    if (!token || !API_BASE_URL) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/user/files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Handle 401 (Unauthorized) - token expired or invalid
        if (response.status === 401) {
          toast({
            variant: 'destructive',
            title: 'Session Expired',
            description: 'Your session has expired. Please login again.',
          });
          logout();
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching user files:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your files. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, router, toast]);
  
    useEffect(() => {
      if (token) {
        fetchUserFiles();
      }
    }, [fetchUserFiles, token]);
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDownload = (uuid: string) => {
    window.open(`/download/${uuid}`, '_blank');
  };

  const sortedFiles = [...files].sort((a, b) => 
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  return (
    <div className="min-h-screen">
      {/* Section Header Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b">
          <h2 className="text-3xl font-bold">Welcome back, {user?.username}!</h2>
          <p className="text-gray-500 mt-2">Manage your files and account settings.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload Files</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Upload</div>
              <p className="text-xs text-muted-foreground">
                Share new files with others
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files.length}</div>
              <p className="text-xs text-muted-foreground">
                Files you've uploaded
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Settings</div>
              <p className="text-xs text-muted-foreground">
                Manage your account
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / My Files */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Files</CardTitle>
                <CardDescription>
                  All your uploaded files and their activity
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUserFiles}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading your files...</p>
              </div>
            ) : sortedFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No files uploaded yet</p>
                <p className="text-sm">Upload your first file to get started!</p>
                <Button 
                  className="mt-4" 
                  onClick={() => router.push('/')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedFiles.map((file) => (
                  <div
                    key={file.uuid}
                    className="flex items-center justify-between p-4 border rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {file.filename}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                          </span>
                          <span>{formatFileSize(file.size)}</span>
                          <span className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {file.downloadCount} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file.uuid)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
