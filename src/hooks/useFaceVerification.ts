import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useFaceVerification() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVerification = async (userId: string, imageData: string) => {
    setSubmitting(true);
    setError(null);

    try {
      // 1. Upload image to storage
      const fileName = `${userId}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('face-verification')
        .upload(fileName, base64ToBlob(imageData), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('face-verification')
        .getPublicUrl(fileName);

      // 3. Create verification record
      const { error: verificationError } = await supabase
        .from('face_verifications')
        .insert({
          user_id: userId,
          face_image_url: publicUrl,
          verification_status: 'pending'
        });

      if (verificationError) throw verificationError;

      return true;
    } catch (err: any) {
      console.error('Error submitting verification:', err);
      setError(err.message || 'Failed to submit verification');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const checkVerificationStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('face_verifications')
        .select('verification_status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data?.verification_status || 'pending';
    } catch (err: any) {
      console.error('Error checking status:', err);
      return 'pending';
    }
  };

  // Helper function to convert base64 to blob
  const base64ToBlob = (base64: string) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  return {
    submitting,
    error,
    submitVerification,
    checkVerificationStatus
  };
}