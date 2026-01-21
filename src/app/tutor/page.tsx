import dynamic from 'next/dynamic';
import EmotionBadge from '@/components/EmotionBadge';

const ChatBox = dynamic(() => import('@/components/ChatBox'), { ssr: false });

export default function TutorPage() {
  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">NeuroPath Tutor</h2>
        </div>

        <div className="bg-card rounded-lg p-4 h-[70vh] flex flex-col">
          <ChatBox />
        </div>
      </div>
    </main>
  );
}
