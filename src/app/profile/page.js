
'use client';

import { useState, useEffect } from 'react';
import DayView from '@/components/DayView';
import DiaryEntry from "@/components/DiaryEntry";

export default function ProfilePage() {
  const [entries, setEntries] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewEntry = () => {
    // Trigger refresh in DayView when a new entry is created
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <DayView refreshTrigger={refreshTrigger} />
      <DiaryEntry onEntryCreated={handleNewEntry} />
      {/* Aquí luego irá la información del perfil */}
    </div>
  );
}
