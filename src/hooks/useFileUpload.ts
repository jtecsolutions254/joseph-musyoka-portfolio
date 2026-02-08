import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadedFile {
  id: string;
  file_name: string;
  file_type: 'cv' | 'project' | 'image' | 'document';
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  created_at: string;
  public_url: string;
}

interface UseFileUploadOptions {
  bucket?: string;
  fileType?: 'cv' | 'project' | 'image' | 'document';
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { bucket = 'portfolio-files', fileType = 'document' } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File,
    description?: string
  ): Promise<UploadedFile | null> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${fileType}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setUploadProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Save metadata to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('portfolio_files')
        .insert({
          file_name: file.name,
          file_type: fileType,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          description: description || null,
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(dbError.message);
      }

      setUploadProgress(100);

      return {
        ...fileRecord,
        public_url: publicUrl,
      } as UploadedFile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      console.error('Upload error:', err);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [bucket, fileType]);

  const deleteFile = useCallback(async (filePath: string, fileId: string): Promise<boolean> => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (storageError) {
        throw new Error(storageError.message);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('portfolio_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw new Error(dbError.message);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      console.error('Delete error:', err);
      return false;
    }
  }, [bucket]);

  const getFiles = useCallback(async (type?: 'cv' | 'project' | 'image' | 'document'): Promise<UploadedFile[]> => {
    try {
      let query = supabase.from('portfolio_files').select('*');
      
      if (type) {
        query = query.eq('file_type', type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Add public URLs
      return (data || []).map(file => ({
        ...file,
        public_url: supabase.storage.from(bucket).getPublicUrl(file.file_path).data.publicUrl,
      })) as UploadedFile[];
    } catch (err) {
      console.error('Fetch error:', err);
      return [];
    }
  }, [bucket]);

  return {
    uploadFile,
    deleteFile,
    getFiles,
    isUploading,
    uploadProgress,
    error,
    clearError: () => setError(null),
  };
}
