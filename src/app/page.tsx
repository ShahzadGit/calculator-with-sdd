import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Arithmetic Calculator
        </h1>
        <Calculator />
      </div>
    </main>
  );
}
