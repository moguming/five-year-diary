export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
        
        <p className="text-sm text-gray-500 mb-2">
          2026년 5월 3일
        </p>

        <h1 className="text-2xl font-bold mb-6">
          오늘의 질문
        </h1>

        <p className="text-lg mb-6 leading-relaxed">
          요즘 가장 자주 떠오르는 생각은 무엇인가요?
        </p>

        <textarea
          className="w-full h-40 border rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="오늘의 답변을 적어보세요..."
        />

        <button
          className="w-full mt-6 bg-black text-white py-4 rounded-2xl text-lg font-semibold"
        >
          저장하기
        </button>

      </div>

    </main>
  );
}