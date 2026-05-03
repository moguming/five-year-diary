"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function getToday() {
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return { month, day };
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const { month, day } = getToday();
    router.replace(`/diary?month=${month}&day=${day}`);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100">
      <p className="text-gray-500">오늘의 일기를 불러오는 중...</p>
    </main>
  );
}