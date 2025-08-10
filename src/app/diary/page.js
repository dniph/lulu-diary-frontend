
'use client';

import { useState } from 'react';
import DiaryEntry from "@/components/DiaryEntry"; 
import DayView from "@/components/DayView";


export default function DiaryPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewEntry = () => {
    // Trigger refresh in DayView when a new entry is created
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-kawaii">
            <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/ATARDECER.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      <DayView refreshTrigger={refreshTrigger} />
      <DiaryEntry onEntryCreated={handleNewEntry} />
    </div>
  );
}