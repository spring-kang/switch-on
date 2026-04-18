"use client";

import { useEffect, useMemo, useState } from "react";

interface DayData {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
}

interface ActivityHeatmapProps {
  data?: DayData[];
  weeks?: number;
}

// 시드 기반 랜덤 (동일한 날짜에 동일한 값)
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 더미 데이터 생성 (결정론적)
const generateDummyData = (weeks: number): DayData[] => {
  const data: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = weeks * 7;

  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // 날짜를 시드로 사용하여 동일한 결과 보장
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const random = seededRandom(seed);

    let level: 0 | 1 | 2 | 3 | 4;
    let count: number;

    if (random < 0.3) {
      level = 0;
      count = 0;
    } else if (random < 0.5) {
      level = 1;
      count = 1;
    } else if (random < 0.7) {
      level = 2;
      count = 2;
    } else if (random < 0.9) {
      level = 3;
      count = 3;
    } else {
      level = 4;
      count = 4;
    }

    data.push({
      date: dateStr,
      level,
      count,
    });
  }

  return data;
};

const LEVEL_COLORS = [
  "bg-[var(--grass-0)]",
  "bg-[var(--grass-1)]",
  "bg-[var(--grass-2)]",
  "bg-[var(--grass-3)]",
  "bg-[var(--grass-4)]",
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

export default function ActivityHeatmap({
  data,
  weeks = 20,
}: ActivityHeatmapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heatmapData = useMemo(() => {
    return data || generateDummyData(weeks);
  }, [data, weeks]);

  // 주별로 데이터 그룹화
  const weeklyData = useMemo(() => {
    const result: DayData[][] = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      result.push(heatmapData.slice(i, i + 7));
    }
    return result;
  }, [heatmapData]);

  // 월 라벨 계산
  const monthLabels = useMemo(() => {
    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;

    weeklyData.forEach((week, weekIndex) => {
      if (week[0]) {
        const firstDay = new Date(week[0].date);
        const month = firstDay.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], index: weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeklyData]);

  const totalActiveDays = heatmapData.filter((d) => d.level > 0).length;
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].level > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [heatmapData]);

  // SSR 중에는 로딩 상태 표시
  if (!mounted) {
    return (
      <div className="w-full">
        <div className="flex gap-6 mb-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-[100px] bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 통계 요약 */}
      <div className="flex gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[var(--grass-4)]" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            총 <span className="font-semibold text-emerald-600">{totalActiveDays}</span>일 달성
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            현재 연속 <span className="font-semibold text-emerald-600">{currentStreak}</span>일
          </span>
        </div>
      </div>

      {/* 히트맵 */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block">
          {/* 월 라벨 */}
          <div className="flex ml-8 mb-1">
            {monthLabels.map(({ month, index }, i) => (
              <div
                key={`${month}-${index}`}
                className="text-xs text-gray-500 dark:text-gray-400"
                style={{
                  marginLeft: i === 0 ? 0 : `${(index - (monthLabels[i - 1]?.index || 0)) * 14 - 20}px`,
                  minWidth: "30px",
                }}
              >
                {month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* 요일 라벨 */}
            <div className="flex flex-col mr-2 justify-between py-[2px]">
              {[1, 3, 5].map((dayIndex) => (
                <div
                  key={dayIndex}
                  className="text-xs text-gray-500 dark:text-gray-400 h-[10px] leading-[10px]"
                >
                  {WEEKDAYS[dayIndex]}
                </div>
              ))}
            </div>

            {/* 그리드 */}
            <div className="flex gap-[3px]">
              {weeklyData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`w-[10px] h-[10px] rounded-sm ${LEVEL_COLORS[day.level]}
                        hover:ring-1 hover:ring-gray-400 cursor-pointer transition-all`}
                      title={`${day.date}: ${day.count}개 미션 완료`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 범례 */}
          <div className="flex items-center justify-end gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Less</span>
            {LEVEL_COLORS.map((color, index) => (
              <div
                key={index}
                className={`w-[10px] h-[10px] rounded-sm ${color}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
