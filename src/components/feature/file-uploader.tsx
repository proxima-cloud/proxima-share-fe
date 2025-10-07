"use client"

import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, File as FileIcon, Copy, Check, RefreshCw, FileCheck, X, AlertTriangle, Mail, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import JSZip from 'jszip';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type UploadResult = {
  fileName: string;
  uuid: string;
  downloadPageUrl: string;
};

type UploadProgress = {
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.92-9.91zM17.43 15.82c-.22-.11-1.3-.65-1.5- .72s-.35-.11-.5.11c-.15.22-.57.72-.7 1.05s-.26.17-.48.06c-.22-.11-1.14-.52-2.17-1.34-1.03-.82-1.72-1.84-1.95-2.17s-.03-.31.08-.42c.11-.11.24-.28.36-.42s.16-.24.24-.4.04-.31-.02-.42c-.06-.11-.5-1.2-.68-1.64s-.36-.37-.5-.37h-.5c-.15 0-.39.06-.59.28s-.76.74-.76 1.8 0 2.09.87 2.27c.11.02 1.48 2.2 3.6 3.12.51.22.92.35 1.24.44.47.14.9.12 1.24-.04.38-.18 1.47-1.06 1.7-1.38.22-.31.22-.58.15-.68-.07-.1-.23-.16-.48-.29z" />
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const ShareButtons = ({ url, text }: { url: string, text: string }) => {
    const { t } = useTranslation();
    const encodedUrl = encodeURIComponent(url);
    const subject = t('share.text', { fileName: text });
    
    const emailBody = t('share.body', { link: url });
    const emailLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    const whatsappText = `${subject}\n${url}`;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
    
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    return (
        <div className="flex items-center gap-1 mt-2">
            <p className="text-sm font-medium text-muted-foreground mr-1">{t('share.title')}:</p>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <a href={emailLink} target="_blank" rel="noopener noreferrer" aria-label="Share via Email">
                                <Mail className="h-4 w-4" />
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Email</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
                                <WhatsAppIcon className="h-5 w-5" />
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>WhatsApp</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <a href={facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                                <FacebookIcon className="h-4 w-4" />
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Facebook</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};


export default function FileUploader() {
  const { t } = useTranslation();

  const getErrorMessage = (status: number): string => {
    switch (status) {
      case 400: return t('uploader.toast.uploadFailed.title', { fileName: '' });
      case 401: return "Unauthorized access";
      case 403: return "Forbidden";
      case 404: return "Resource not found";
      case 409: return "Duplicate resource";
      case 422: return "Unprocessable Entity";
      case 500: return "Something went wrong";
      case 502: case 503: case 504: return "Server temporarily unavailable, please try again later.";
      default: return "An unknown error occurred. Please try again.";
    }
  };
  
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleNewFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;

    const filesArray = Array.from(incomingFiles);
    const validFiles: File[] = [];
    const oversizedFiles: File[] = [];

    filesArray.forEach(file => {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            oversizedFiles.push(file);
        } else {
            validFiles.push(file);
        }
    });

    if (oversizedFiles.length > 0) {
        toast({
            variant: "destructive",
            title: t('uploader.toast.fileTooLarge.title'),
            description: t('uploader.toast.fileTooLarge.description', {
                files: oversizedFiles.map(f => f.name).join(', '),
                maxSize: MAX_FILE_SIZE_MB
            }),
        });
    }
    
    setFiles(validFiles);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleNewFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleNewFiles(e.target.files);
    }
  };
  
  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  }

  const uploadFile = useCallback((file: File): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => new Map(prev).set(file.name, { progress, status: 'uploading' }));
        }
      });

      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            const downloadPageUrl = `${window.location.origin}/download/${response.uuid}`;
            resolve({
              fileName: file.name,
              uuid: response.uuid,
              downloadPageUrl,
            });
          } else {
            reject({
              status: xhr.status,
              message: getErrorMessage(xhr.status),
              fileName: file.name,
            });
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject({
          status: 0,
          message: 'A network error occurred. Please check your connection.',
          fileName: file.name,
        });
      });

      xhr.open('POST', `${API_BASE_URL}/api/public/files/upload`, true);
      xhr.send(formData);
    });
  }, [t]);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const initialProgress = new Map(files.map(f => [f.name, { progress: 0, status: 'uploading' as const }]));
    setUploadProgress(initialProgress);
    setUploadResults([]);

    const results = await Promise.allSettled(files.map(file => uploadFile(file) as Promise<UploadResult>));

    const successfulUploads: UploadResult[] = [];
    results.forEach((result, index) => {
      const file = files[index];
      if (result.status === 'fulfilled') {
        successfulUploads.push(result.value);
        setUploadProgress(prev => new Map(prev).set(file.name, { progress: 100, status: 'success' }));
      } else {
        const { message, fileName } = result.reason;
        toast({
          title: t('uploader.toast.uploadFailed.title', { fileName }),
          description: message,
          variant: "destructive",
        });
        setUploadProgress(prev => new Map(prev).set(file.name, { progress: 0, status: 'error' }));
      }
    });

    setUploadResults(successfulUploads);
    setIsUploading(false);
    
    if (successfulUploads.length > 0 && successfulUploads.length === files.length) {
      toast({
        title: t('uploader.toast.allFilesUploaded.title'),
        description: t('uploader.toast.allFilesUploaded.description', { count: successfulUploads.length }),
      });
    } else if (successfulUploads.length > 0) {
       toast({
        title: t('uploader.toast.uploadsComplete.title'),
        description: t('uploader.toast.uploadsComplete.description', { successCount: successfulUploads.length, totalCount: files.length }),
      });
    }
    
    setFiles([]);

  }, [files, toast, uploadFile, t]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLinks(prev => ({ ...prev, [url]: true }));
      toast({
        title: t('uploader.toast.copied.title'),
        description: t('uploader.toast.copied.description'),
      });
      setTimeout(() => {
        setCopiedLinks(prev => ({ ...prev, [url]: false }));
      }, 3000);
    });
  };
  
  const handleDownloadZip = async () => {
    if (uploadResults.length < 2) return;

    setIsZipping(true);
    
    const zip = new JSZip();

    try {
        await Promise.all(uploadResults.map(async (result) => {
            const downloadUrl = `${API_BASE_URL}/api/public/files/download/${result.uuid}`;
            const response = await fetch(downloadUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${result.fileName}`);
            }
            const blob = await response.blob();
            zip.file(result.fileName, blob);
        }));

        const zipBlob = await zip.generateAsync({ type: "blob" });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `ProximaShare-archive-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error("Error creating ZIP file:", error);
        toast({
            title: t('uploader.toast.zipError.title'),
            description: t('uploader.toast.zipError.description'),
            variant: "destructive",
        });
    } finally {
        setIsZipping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const resetState = () => {
    setFiles([]);
    setUploadResults([]);
    setUploadProgress(new Map());
    setIsUploading(false);
    setCopiedLinks({});
     if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const renderContent = () => {
    if (uploadResults.length > 0) {
      return (
        <div className="text-center w-full space-y-4 animate-in fade-in-50">
          <FileCheck className="mx-auto h-16 w-16 text-success" />
          <h3 className="text-2xl font-semibold">{t('uploader.uploadsComplete')}</h3>
          <p className="text-muted-foreground">{t('uploader.completeDescription')}</p>

          {uploadResults.length > 1 && (
            <Button onClick={handleDownloadZip} disabled={isZipping}>
              {isZipping ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {t('uploader.zipping')}
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  {t('uploader.downloadAllZip')}
                </>
              )}
            </Button>
          )}

          <ScrollArea className="h-60 w-full">
            <div className="space-y-4 pr-4 text-left">
              {uploadResults.map((result) => (
                <div key={result.uuid} className="space-y-2 rounded-lg border bg-muted/30 p-3">
                  <Label htmlFor={`share-link-${result.uuid}`} className="truncate block font-medium">{result.fileName}</Label>
                  <div className="relative">
                    <Input id={`share-link-${result.uuid}`} value={result.downloadPageUrl} readOnly className="pr-10 h-9 bg-background" />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => handleCopy(result.downloadPageUrl)}>
                      {copiedLinks[result.downloadPageUrl] ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <ShareButtons url={result.downloadPageUrl} text={result.fileName} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      );
    }

    if (isUploading) {
      return (
        <div className="w-full space-y-4">
          <h3 className="text-center font-semibold text-lg">{t('uploader.uploading')}</h3>
          <ScrollArea className="h-48 w-full">
            <div className="space-y-4 pr-4">
              {files.map(file => {
                const progressInfo = uploadProgress.get(file.name) || { progress: 0, status: 'uploading' };
                return (
                  <div key={file.name}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <p className="font-medium truncate pr-2 w-full">{file.name}</p>
                      {progressInfo.status === 'uploading' && <p className="text-muted-foreground">{progressInfo.progress}%</p>}
                      {progressInfo.status === 'success' && <Check className="h-5 w-5 text-success" />}
                      {progressInfo.status === 'error' && <AlertTriangle className="h-5 w-5 text-destructive" />}
                    </div>
                    <Progress 
                      value={progressInfo.progress} 
                      className={cn(
                        "w-full h-2",
                        progressInfo.status === 'error' && '[&>div]:bg-destructive'
                      )} 
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      );
    }
    
    if (files.length > 0) {
      return (
        <div className="w-full space-y-3">
          <h3 className="text-center font-semibold text-lg">{t('uploader.filesToUpload')}</h3>
          <ScrollArea className="h-40 w-full">
            <div className="space-y-2 pr-4">
              {files.map(file => (
                <div key={file.name} className="flex items-center justify-between p-2 rounded-md border bg-muted/50 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileIcon className="h-5 w-5 shrink-0" />
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-muted-foreground shrink-0 ml-auto">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeFile(file.name)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      );
    }

    return (
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="File upload area"
        className={cn(
          "w-full h-full p-6 sm:p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
          isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
        )}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
        <UploadCloud className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 font-semibold">{t('uploader.dragOrClick')}</p>
        <p className="text-sm text-muted-foreground">{t('uploader.selectPrompt')}</p>
      </div>
    );
  };
  
  const renderFooter = () => {
    if (uploadResults.length > 0) {
       return (
          <Button onClick={resetState}>
            <RefreshCw className="mr-2 h-4 w-4" /> {t('uploader.uploadMore')}
          </Button>
       );
    }
    
    if (files.length > 0) {
      return (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleUpload} disabled={isUploading} className="w-full sm:w-auto">
            <UploadCloud className="mr-2 h-4 w-4" /> 
            {files.length > 1 ? t('uploader.uploadButton_plural', { count: files.length }) : t('uploader.uploadButton', { count: files.length })}
          </Button>
          <Button variant="outline" onClick={clearFiles} className="w-full sm:w-auto">
            {t('uploader.clearSelection')}
          </Button>
        </div>
      );
    }
    
    return (
       <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>{t('uploader.chooseFiles')}</Button>
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">{t('uploader.title')}</CardTitle>
        {uploadResults.length === 0 && <CardDescription className="text-center whitespace-pre-line">
            {t('uploader.description', { maxSize: MAX_FILE_SIZE_MB })}
        </CardDescription>}
      </CardHeader>
      <CardContent className="min-h-[250px] flex items-center justify-center p-4 sm:p-6">
        {renderContent()}
      </CardContent>
      <CardFooter className="flex justify-center">
        {renderFooter()}
      </CardFooter>
    </Card>
  );
}
