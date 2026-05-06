"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Nanum_Pen_Script } from "next/font/google";

type DiaryItem = {
  year: string;
  answer: string;
};

const nanumPen = Nanum_Pen_Script({
  subsets: ["latin"],
  weight: ["400"],
});

const questions: Record<string, string> = {
  "05-01": "가장 좋아하는 꽃이나 식물이 있다면?",
  "05-02": "하루 동안 초능력을 가질 수 있다면 어떤 것을 훤하는가?",
  "05-03": "나는 깔끔한 사람인가, 지저분한 사람인가?",
  "05-04": "마지막으로 수영을 한 적은 언제인가?",
  "05-05": "정말 신나는 하루였다. 그 이유는?",
  "05-06": "내 인생을 영화로 만든다면 주인공 역은 누구로 하고 싶은가?",
  "05-07": "좋은 적이란 과연 존재할까?",

  "05-08": "어머니에게 하고 싶은 말은?",
  "05-09": "오늘 해야 할 일 중 미루고 싶은 일은 무엇인가?",
  "05-10": "최근에 한 가장 창의적인 일은?",
  "05-11": "오늘 하루를 어떻게 시작했는가?",
  "05-12": "현재 탐구하고 있는 분야가 있다면?",
  "05-13": "오늘 나에게 애정을 보여준 사람은?",
  "05-14": "지금까지 이룬 것 중 성취감이 가장 컸던 일은?",

  "05-15": "마지막으로 참석한 모임은?",
  "05-16": "무슨 요일을 가장 좋아하는가? 그 이유는?",
  "05-17": "나는 오늘 __을 제거했다",
  "05-18": "주변인의 죽음 중 가장 슬펐던 사람은?",
  "05-19": "타임머신을 타고 과거로 돌아가 꼭 바꾸고 싶은 일이 있다면?",
  "05-20": "사랑을 위해 저지른 가장 정신 나간 것은?",
  "05-21": "내 연봉은 얼마인가?",

  "05-22": "현재 나의 헤어스타일은?",
  "05-23": "가장 최근에 말다툼을 한 적이 있는가? 무슨 일 때문이었나?",
  "05-24": "오늘 나에게 동기를 부여해준 일은?",
  "05-25": "내일 어디든 여행할 수 있다면 가고 싶은 곳은?",
  "05-26": "현재 나에게 위안을 주는 것은?",
  "05-27": "오늘 나를 괴롭힌 일들을 적어보자",
  "05-28": "산과 바다 중 어느 곳이 더 좋은가?",

  "05-29": "휴가가 하루 주어진다면 무엇을 하고 싶은가?",
  "05-30": "오늘 읽은 가장 인상적인 글귀는?",
  "05-31": "나의 총 자산은 얼마인가? 빚은?"
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

        <h1 className={`${nanumPen.className} text-[90px] leading-none`}>
          MAY {day}
        </h1>

        <div className="relative flex flex-col gap-2">

          {isToday && (
            <button
              onClick={saveDiary}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              저장하기
            </button>
          )}

          <a
            href="/calendar"
            className="block rounded-xl bg-stone-200 px-4 py-2 text-center text-sm text-black font-semibold"
          >
            달력 보기
          </a>

          <button
            onClick={() => setShowBackupMenu(!showBackupMenu)}
            className="rounded-xl bg-stone-200 px-4 py-2 text-sm text-black font-semibold"
          >
            저장 관리
          </button>

          {showBackupMenu && (
            <div className="absolute right-0 top-36 z-10 w-52 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">

              <button
                onClick={backupDiary}
                className="mb-2 w-full rounded-xl bg-stone-800 py-3 text-sm font-semibold text-white"
              >
                백업 파일 저장하기
              </button>

              <label className="block w-full cursor-pointer rounded-xl bg-stone-100 py-3 text-center text-sm text-black font-semibold">
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
      </div>

      <div className="bg-stone-100 rounded-2xl p-5 mb-6">

        <p className="text-sm text-black mb-2">
          오늘의 질문
        </p>

        <p className="text-lg font-medium leading-relaxed text-center text-black">
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

        {/* <a
          href="/calendar"
          className="block w-full mt-6 bg-stone-200 text-center text-black py-4 rounded-2xl text-lg font-semibold"
        >
          달력 보기
        </a> */}
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