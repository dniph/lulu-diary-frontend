'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfileLink() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/lulu-diary/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) {
    return <span className="hover:underline opacity-50">Profile</span>;
  }

  if (!userProfile) {
    return <Link href="/login" className="hover:underline">Profile</Link>;
  }

  return (
    <Link href={`/${userProfile.username}`} className="hover:underline">
      Profile
    </Link>
  );
}
