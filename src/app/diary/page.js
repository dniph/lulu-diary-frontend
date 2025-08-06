

import DiaryEntry from "@/components/DiaryEntry"; 


export default function DiaryPage() {
  return (
    <div className="min-h-screen relative overflow-hidden font-kawaii">
            <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/ATARDECER.JPG')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      <DiaryEntry />
    </div>
  );
}