import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

type UploadedFile = {
  _id: string;
  fileUrl: string;
  originalName: string;
};

const UploadedFiles: React.FC = () => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    if (!isAuthenticated || !user?.sub || isLoading) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/uploads/${user.sub}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  }, [user?.sub, isAuthenticated, isLoading, getAccessTokenSilently]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    const handleFocus = () => {
      fetchFiles();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.sub) return;
    setUploading(true);

    try {
      const token = await getAccessTokenSilently();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.sub);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/uploads`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFiles(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${import.meta.env.VITE_API_URL}/uploads/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(prev => prev.filter(f => f._id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <ul className="list-disc list-inside">
        {files.map(file => (
          <li key={file._id} className="flex justify-between items-center">
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 underline"
            >
              {file.originalName}
            </a>
            <button
              onClick={() => handleDelete(file._id)}
              className="text-red-600 hover:text-red-800 ml-4 text-xs"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <label className="mt-4 inline-block bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg cursor-pointer">
        {uploading ? 'Uploading...' : 'Upload New Document'}
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default UploadedFiles;