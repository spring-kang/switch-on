"use client";

import { useState } from "react";
import { Mission, completeMission, CompleteMissionRequest } from "@/lib/api";

interface MissionCardProps {
  mission: Mission;
  challengeId: number;
  onComplete: () => void;
}

export default function MissionCard({ mission, challengeId, onComplete }: MissionCardProps) {
  const [completing, setCompleting] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<"BREAKFAST" | "LUNCH" | "DINNER" | null>(null);

  const handleComplete = async (mealType?: "BREAKFAST" | "LUNCH" | "DINNER") => {
    try {
      setCompleting(true);
      const request: CompleteMissionRequest = {};
      if (mealType) {
        request.mealType = mealType;
      }
      await completeMission(challengeId, mission.id, request);
      onComplete();
    } catch (err) {
      alert(err instanceof Error ? err.message : "미션 완료에 실패했습니다");
    } finally {
      setCompleting(false);
      setSelectedMeal(null);
    }
  };

  if (mission.type === "FASTING") {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
            <span className="text-2xl">⏰</span>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            mission.completedToday
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
          }`}>
            {mission.completedToday ? "완료" : "진행중"}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {mission.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {mission.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-emerald-600">{mission.eatingWindowStart}</span> ~{" "}
            <span className="font-medium text-emerald-600">{mission.eatingWindowEnd}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {mission.fastingHours}시간 단식
          </div>
        </div>
        {!mission.completedToday && (
          <button
            onClick={() => handleComplete()}
            disabled={completing}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {completing ? "처리중..." : "단식 완료"}
          </button>
        )}
      </div>
    );
  }

  // MEAL_LOG
  const meals = [
    { type: "BREAKFAST" as const, label: "아침", icon: "🌅" },
    { type: "LUNCH" as const, label: "점심", icon: "☀️" },
    { type: "DINNER" as const, label: "저녁", icon: "🌙" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
          <span className="text-2xl">📸</span>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          mission.completedToday
            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
        }`}>
          {mission.completedMealsToday}/{mission.requiredMeals} 완료
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {mission.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {mission.description}
      </p>
      <div className="flex gap-2">
        {meals.map((meal) => {
          // 이미 완료한 식사인지 체크 (간단히 completedMealsToday로 순서대로 체크)
          const mealIndex = meals.findIndex(m => m.type === meal.type);
          const isCompleted = mealIndex < mission.completedMealsToday;

          return (
            <button
              key={meal.type}
              onClick={() => !isCompleted && handleComplete(meal.type)}
              disabled={completing || isCompleted}
              className={`flex-1 p-3 rounded-xl text-center transition-all ${
                isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500"
                  : "bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-400 cursor-pointer"
              } disabled:cursor-not-allowed`}
            >
              <div className="text-lg mb-1">{meal.icon}</div>
              <div className={`text-xs font-medium ${
                isCompleted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {meal.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
