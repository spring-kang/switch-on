"use client";

import { useEffect, useMemo, useState } from "react";

interface DayData {
  date: string;
  completed: boolean; // 모든 미션 완료 여부
  totalMissions: number;
  completedMissions: number;
}

interface MonthlyHeatmapProps {
  data?: DayData[];
}

// 시드 기반 랜덤
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 한 달치 더미 데이터 생성
const generateMonthData = (year: number, month: number): DayData[] => {
  const data: DayData[] = [];
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    const dateStr = date.toISOString().split("T")[0];

    // 미래 날짜는 미완료 처리
    if (date > today) {
      data.push({
        date: dateStr,
        completed: false,
        totalMissions: 2,
        completedMissions: 0,
      });
      continue;
    }

    const seed = year * 10000 + (month + 1) * 100 + d;
    const random = seededRandom(seed);

    // 70% 확률로 완료
    const completed = random > 0.3;

    data.push({
      date: dateStr,
      completed,
      totalMissions: 2, // 단식 + 식단인증
      completedMissions: completed ? 2 : Math.floor(random * 2),
    });
  }

  return data;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthlyHeatmap({ data }: MonthlyHeatmapProps) {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthData = useMemo(() => {
    return data || generateMonthData(year, month);
  }, [data, year, month]);

  // 달력 그리드 생성
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (DayData | null)[][] = [];
    let currentWeek: (DayData | null)[] = [];

    // 첫 주 빈 칸 채우기
    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push(null);
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = monthData.find(
        (d) => new Date(d.date).getDate() === day
      ) || {
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        completed: false,
        totalMissions: 2,
        completedMissions: 0,
      };

      currentWeek.push(dayData);

      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }

    // 마지막 주 빈 칸 채우기
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
      grid.push(currentWeek);
    }

    return grid;
  }, [monthData, year, month]);

  // 통계 계산
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastDays = monthData.filter((d) => new Date(d.date) <= today);
    const completedDays = pastDays.filter((d) => d.completed).length;
    const totalDays = pastDays.length;

    // 현재 연속 달성일 계산
    let currentStreak = 0;
    for (let i = pastDays.length - 1; i >= 0; i--) {
      if (pastDays[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      completedDays,
      totalDays,
      failedDays: totalDays - completedDays,
      rate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
      currentStreak,
    };
  }, [monthData]);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    if (next <= new Date()) {
      setCurrentDate(next);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isCurrentMonth =
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  const monthName = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  if (!mounted) {
    return (
      <div className="w-full">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
        <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white min-w-[140px] text-center">
            {monthName}
          </h3>
          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {!isCurrentMonth && (
          <button
            onClick={goToToday}
            className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
          >
            오늘로 이동
          </button>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.completedDays}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">완료</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-red-500">{stats.failedDays}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">미완료</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.rate}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">달성률</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">연속</div>
        </div>
      </div>

      {/* 캘린더 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-1 ${
                index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="space-y-2">
          {calendarGrid.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <div key={`empty-${dayIndex}`} className="aspect-square" />;
                }

                const dayNum = new Date(day.date).getDate();
                const todayStr = new Date().toISOString().split("T")[0];
                const isToday = day.date === todayStr;
                const isFuture = new Date(day.date) > new Date();

                // 색상 결정: 완료=초록, 미완료=빨강, 미래=회색
                let bgColor = "bg-gray-200 dark:bg-gray-700"; // 미래/기본
                let textColor = "text-gray-400 dark:text-gray-500";

                if (!isFuture) {
                  if (day.completed) {
                    bgColor = "bg-emerald-500";
                    textColor = "text-white";
                  } else {
                    bgColor = "bg-red-400";
                    textColor = "text-white";
                  }
                }

                return (
                  <div
                    key={day.date}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative cursor-pointer transition-all
                      ${bgColor}
                      ${isToday ? "ring-2 ring-gray-900 dark:ring-white ring-offset-2 dark:ring-offset-gray-900" : ""}
                      ${!isFuture ? "hover:scale-105 hover:shadow-md" : "opacity-40"}
                    `}
                    title={isFuture ? "예정" : day.completed ? "미션 완료!" : "미션 미완료"}
                  >
                    <span className={`text-sm font-semibold ${textColor}`}>
                      {dayNum}
                    </span>
                    {!isFuture && (
                      <span className={`text-[10px] ${textColor} opacity-80`}>
                        {day.completed ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span>완료</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-400" />
          <span>미완료</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <span>예정</span>
        </div>
      </div>
    </div>
  );
}
