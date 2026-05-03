"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type DiaryItem = {
  year: string;
  answer: string;
};

const questions: Record<string, string> = {
  "05-01": "요즘 나를 가장 기분 좋게 하는 것은?",
  "05-02": "최근 가장 많이 떠오르는 생각은?",
  "05-03": "오늘 하루를 한 문장으로 표현한다면?",
  "05-04": "지금 가장 고마운 사람은?",
  "05-05": "어린 시절의 나에게 해주고 싶은 말은?",
};

function makeEmptyItems(): DiaryItem[] {
  return [
    { year: "", answer: "" },
    { year: "", answer: "" },
    { year: "", answer: "" },
    { year: "", answer: "" },
    { year: "", answer: "" },
  ];
}

function getTodayKey() {
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${month}-${day}`;
}

function DiaryContent() {
  const searchParams = useSearchParams();

  const month = searchParams.get("month") || "05";
  const day = searchParams.get("day") || "03";

  const selectedKey = `${month}-${day}`;
  const todayKey = getTodayKey();
  const isToday = selectedKey === todayKey;

  const storageKey = `diary-${selectedKey}`;

  const [items, setItems] = useState<DiaryItem[]>(makeEmptyItems());
  const [showBackupMenu, setShowBackupMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(makeEmptyItems());
    }
  }, [storageKey]);

  const updateItem = (
    index: number,
    field: "year" | "answer",
    value: string
  ) => {
    const copied = [...items];
    copied[index] = {
      ...copied[index],
      [field]: value,
    };

    setItems(copied);
  };

  const saveDiary = () => {
    if (!isToday) {
      alert("오늘 날짜의 답변만 작성할 수 있어요.");
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(items));
    alert("저장됐어요.");
  };

  const backupDiary = () => {
    const data: Record<string, string> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("diary-")) {
        data[key] = localStorage.getItem(key) || "";
      }
    }

    const file = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");

    a.href = url;
    a.download = "five-year-diary-backup.json";
    a.click();

    URL.revokeObjectURL(url);
    setShowBackupMenu(false);
  };

  const restoreDiary = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));

        Object.keys(data).forEach((key) => {
          if (key.startsWith("diary-")) {
            localStorage.setItem(key, data[key]);
          }
        });

        alert("복원됐어요. 새로고침하면 반영돼요.");
        setShowBackupMenu(false);
      } catch {
        alert("복원 파일이 올바르지 않아요.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen bg-stone-100 p-5">
      <div className="mx-auto w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <div className="relative mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {Number(month)}월 {Number(day)}일
            </p>

            <h1 className="text-3xl font-bold">5년 일기장</h1>
          </div>

          <button
            onClick={() => setShowBackupMenu(!showBackupMenu)}
            className="rounded-xl bg-stone-200 px-4 py-2 text-sm font-semibold"
          >
            저장 관리
          </button>

          {showBackupMenu && (
            <div className="absolute right-0 top-16 z-10 w-52 rounded-2xl bg-white p-3 shadow-xl border border-gray-100">
              <button
                onClick={backupDiary}
                className="w-full rounded-xl bg-stone-800 py-3 text-sm font-semibold text-white mb-2"
              >
                백업 파일 저장하기
              </button>

              <label className="block w-full cursor-pointer rounded-xl bg-stone-100 py-3 text-center text-sm font-semibold">
                백업 파일 불러오기
                <input
                  type="file"
                  accept="application/json"
                  onChange={restoreDiary}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <div className="bg-stone-100 rounded-2xl p-5 mb-6">
          <p className="text-sm text-gray-500 mb-2">오늘의 질문</p>
          <p className="text-lg font-medium leading-relaxed">
            {questions[selectedKey] || "오늘 하루에서 가장 기억에 남는 일은?"}
          </p>
        </div>

        {!isToday && (
          <div className="mb-5 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
            오늘 날짜가 아니므로 답변을 작성할 수 없어요.
            저장된 답변만 볼 수 있어요.
          </div>
        )}

        <div className="space-y-5">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 p-4">
              <input
                value={item.year}
                onChange={(e) => updateItem(index, "year", e.target.value)}
                disabled={!isToday}
                placeholder="연도 입력 예: 2026"
                className="w-full mb-3 rounded-xl border border-gray-200 p-3 disabled:bg-gray-100"
              />

              <textarea
                value={item.answer}
                onChange={(e) => updateItem(index, "answer", e.target.value)}
                disabled={!isToday}
                placeholder="답변을 적어보세요"
                className="w-full h-28 rounded-xl border border-gray-200 p-3 resize-none disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>

        {isToday && (
          <button
            onClick={saveDiary}
            className="w-full mt-6 bg-black text-white py-4 rounded-2xl text-lg font-semibold"
          >
            저장하기
          </button>
        )}

        <a
          href="/calendar"
          className="block w-full mt-6 bg-stone-200 text-center text-black py-4 rounded-2xl text-lg font-semibold"
        >
          달력 보기
        </a>
      </div>
    </main>
  );
}

export default function DiaryPage() {
  return (
    <Suspense>
      <DiaryContent />
    </Suspense>
  );
}