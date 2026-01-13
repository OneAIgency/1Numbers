import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useProfiles = () => {
  const { isAuthenticated } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfiles = useCallback(async () => {
    if (!isAuthenticated) {
      setProfiles([]);
      setActiveProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getAllProfiles();
      if (response.success && response.profiles) {
        const profilesList = response.profiles as Profile[];
        setProfiles(profilesList);
        const active = profilesList.find(p => p.isActive) || profilesList[0] || null;
        setActiveProfile(active);
      } else {
        setProfiles([]);
        setActiveProfile(null);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      setProfiles([]);
      setActiveProfile(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const switchProfile = useCallback(async (profileId: string) => {
    try {
      const response = await api.setActiveProfile(profileId);
      if (response.success) {
        // Reload profiles to get updated state
        await loadProfiles();
        return { success: true };
      }
      return { success: false, error: 'Failed to switch profile' };
    } catch (error) {
      console.error('Error switching profile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to switch profile' 
      };
    }
  }, [loadProfiles]);

  const createProfile = useCallback(async (data: {
    fullName: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
    setAsActive?: boolean;
  }) => {
    try {
      const response = await api.createProfile(data);
      if (response.success) {
        await loadProfiles();
        return { success: true, profile: response.profile };
      }
      return { success: false, error: 'Failed to create profile' };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create profile' 
      };
    }
  }, [loadProfiles]);

  const updateProfile = useCallback(async (profileId: string, data: {
    fullName: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
  }) => {
    try {
      const response = await api.updateProfile(profileId, data);
      if (response.success) {
        await loadProfiles();
        return { success: true, profile: response.profile };
      }
      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  }, [loadProfiles]);

  const deleteProfile = useCallback(async (profileId: string) => {
    try {
      const response = await api.deleteProfile(profileId);
      if (response.success) {
        await loadProfiles();
        return { success: true };
      }
      return { success: false, error: 'Failed to delete profile' };
    } catch (error) {
      console.error('Error deleting profile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete profile' 
      };
    }
  }, [loadProfiles]);

  return {
    profiles,
    activeProfile,
    loading,
    refetch: loadProfiles,
    switchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    hasProfiles: profiles.length > 0,
  };
};

