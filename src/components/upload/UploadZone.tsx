import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Check, AlertCircle, Copy, Mail, ExternalLink, Clock, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  uuid?: string;
  shareableLink?: string;
  errorMessage?: string;
  uploadTime?: Date;
  timeRemaining?: number;
  downloadsRemaining?: number;
}

const API_BASE_URL = 'http://proximacloud.ddns.net:8080';

export const UploadZone: React.FC = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<UploadFile[]>([]);

  // Timer effect for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.status === 'success' && file.uploadTime && file.timeRemaining !== undefined) {
          const elapsed = Math.floor((Date.now() - file.uploadTime.getTime()) / 1000);
          const remaining = Math.max(0, 300 - elapsed); // 5 minutes = 300 seconds
          
          if (remaining === 0) {
            return { ...file, timeRemaining: 0 };
          }
          
          return { ...file, timeRemaining: remaining };
        }
        return file;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const uploadFileToAPI = async (file: File, uploadFileId: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add progress simulation
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === uploadFileId && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + Math.random() * 10 + 5, 85);
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 300);

      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage = errorData;
          }
        } catch (e) {
          // Use default error message
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (!result.uuid) {
        throw new Error('Invalid response: missing UUID');
      }

      const shareableLink = `${API_BASE_URL}/api/files/download/${result.uuid}`;

      setFiles(prev => prev.map(f => {
        if (f.id === uploadFileId) {
          return {
            ...f,
            progress: 100,
            status: 'success' as const,
            uuid: result.uuid,
            shareableLink,
            uploadTime: new Date(),
            timeRemaining: 300, // 5 minutes in seconds
            downloadsRemaining: 3
          };
        }
        return f;
      }));
    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Upload failed';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Connection failed. Please check if the server is running and accessible.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS error. Please contact administrator to configure server.';
        } else {
          errorMessage = error.message;
        }
      }

      setFiles(prev => prev.map(f => {
        if (f.id === uploadFileId) {
          return {
            ...f,
            status: 'error' as const,
            errorMessage
          };
        }
        return f;
      }));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: 'error' as const,
          errorMessage: t('upload.fileSizeError')
        };
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'uploading' as const,
      };
    });

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files that passed validation
    newFiles.forEach(uploadFile => {
      if (uploadFile.status === 'uploading') {
        uploadFileToAPI(uploadFile.file, uploadFile.id);
      }
    });
  }, [t]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      // Show success feedback
      console.log('Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: select the text
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const shareViaEmail = (link: string, fileName: string) => {
    const subject = encodeURIComponent(`Shared file: ${fileName}`);
    const body = encodeURIComponent(`Hi,\n\nI've shared a file with you. You can download it using the link below:\n\n${link}\n\nPlease note: This link will expire after 5 minutes or 3 successful downloads, whichever comes first.\n\nBest regards`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.csv'],
      'application/zip': ['.zip', '.rar', '.7z'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-105'
            : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500 bg-white/70 dark:bg-neutral-800/70'
        } backdrop-blur-sm`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Upload className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 ${
            isDragActive ? 'text-primary-600' : 'text-neutral-400 dark:text-neutral-500'
          }`} />
        </motion.div>

        <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-neutral-800 dark:text-neutral-200">
          {isDragActive ? t('upload.dropFiles') : t('upload.title')}
        </h3>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
          {t('upload.description')}
        </p>

        <motion.button
          className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 text-sm md:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          {t('upload.browse')}
        </motion.button>

        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-3 md:mt-4">
          {t('upload.maxSize')}
        </p>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="mt-6 md:mt-8 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {files.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <File className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {uploadFile.status === 'success' && (
                      <Check className="w-5 h-5 text-success-600" />
                    )}
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-error-600" />
                    )}
                    <motion.button
                      onClick={() => removeFile(uploadFile.id)}
                      className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4 text-neutral-500" />
                    </motion.button>
                  </div>
                </div>

                {uploadFile.status !== 'error' && (
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden mb-2">
                    <motion.div
                      className={`h-full rounded-full ${
                        uploadFile.status === 'success'
                          ? 'bg-success-500'
                          : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadFile.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {uploadFile.status === 'success'
                      ? t('upload.completed')
                      : uploadFile.status === 'error'
                      ? uploadFile.errorMessage || t('upload.error')
                      : t('upload.uploading')
                    }
                  </span>
                  {uploadFile.status !== 'error' && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {Math.round(uploadFile.progress)}%
                    </span>
                  )}
                </div>

                {uploadFile.status === 'success' && uploadFile.shareableLink && (
                  <motion.div
                    className="mt-4 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm font-medium text-success-800 dark:text-success-200 mb-2">
                      {t('upload.shareFile')}
                    </p>
                    
                    {/* Dynamic Link Expiration Warning */}
                    <div className="mb-3 p-2 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
                      <div className="flex items-start space-x-2">
                        <Clock className="w-4 h-4 text-warning-600 dark:text-warning-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-warning-800 dark:text-warning-200">
                          <p className="font-medium mb-1">{t('upload.linkExpiration.title')}</p>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span className={`font-mono ${uploadFile.timeRemaining && uploadFile.timeRemaining < 60 ? 'text-red-600 dark:text-red-400 font-bold' : ''}`}>
                                {uploadFile.timeRemaining !== undefined ? formatTime(uploadFile.timeRemaining) : '5:00'}
                              </span>
                              <span className="ml-1">remaining</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="w-3 h-3" />
                              <span className={`font-mono ${uploadFile.downloadsRemaining === 1 ? 'text-red-600 dark:text-red-400 font-bold' : ''}`}>
                                {uploadFile.downloadsRemaining || 3}
                              </span>
                              <span className="ml-1">downloads remaining</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={uploadFile.shareableLink}
                          readOnly
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <motion.button
                          onClick={() => copyToClipboard(uploadFile.shareableLink!)}
                          className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-1 text-xs"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={t('upload.copyLink')}
                        >
                          <Copy className="w-3 h-3" />
                          <span className="hidden sm:inline">{t('upload.copy')}</span>
                        </motion.button>
                        <motion.button
                          onClick={() => shareViaEmail(uploadFile.shareableLink!, uploadFile.file.name)}
                          className="px-3 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-1 text-xs"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={t('upload.shareEmail')}
                        >
                          <Mail className="w-3 h-3" />
                          <span className="hidden sm:inline">{t('upload.email')}</span>
                        </motion.button>
                        <motion.button
                          onClick={() => window.open(uploadFile.shareableLink!, '_blank')}
                          className="px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center space-x-1 text-xs"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={t('upload.openLink')}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="hidden sm:inline">{t('upload.open')}</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};