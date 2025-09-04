import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CreatorDashboard } from '@/components/creator/CreatorDashboard';
import MovieBoxNavbar from '@/components/layout/MovieBoxNavbar';

export default function CreatorStudio() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-streaming-darker">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-streaming-accent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-streaming-darker">
      <MovieBoxNavbar />
      <div className="pt-16">
        <CreatorDashboard />
      </div>
    </div>
  );
}