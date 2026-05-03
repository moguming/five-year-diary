"use client";

import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();

  const goDiary = (day: string) => {
    router.push(`/diary?month=05&day=${day}`);
  };

  const daysInMay = Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");

    const index = i;
    const col = index % 7;
    const row = Math.floor(index / 7);

    return {
      day,
      // 네가 만든 달력 이미지 기준 위치
      left: 18.8 + col * 10.35,
      top: 47.4 + row * 9.65,
    };
  });

  return (
    <main className="min-h-screen bg-[#fde7da]">
      <div className="mx-auto w-full max-w-md">
        <div className="relative w-full">
          <img
            src="/images/calendar-may.jpg"
            alt="5월 달력"
            className="block w-full"
          />

          {daysInMay.map(({ day, left, top }) => (
            <button
              key={day}
              onClick={() => goDiary(day)}
              aria-label={`5월 ${Number(day)}일 일기로 이동`}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: "9%",
                height: "5%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "transparent",
              }}
            />
          ))}

          <button
            onClick={() => router.back()}
            className="absolute left-5 top-5 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold shadow"
          >
            돌아가기
          </button>
        </div>
      </div>
    </main>
  );
}