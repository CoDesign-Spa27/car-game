import dynamic from 'next/dynamic';

const GameScene = dynamic(() => import('./_components/GameScene'), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">3D Survival Game</h1>
      <div className="w-full h-full">
        <GameScene />
      </div>
    </main>
  );
}
