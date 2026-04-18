"use client";

import { useState } from "react";
import Link from "next/link";
import MonthlyHeatmap from "@/components/MonthlyHeatmap";
import Header from "@/components/Header";

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<{
    status?: string;
    service?: string;
    timestamp?: string;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/health");
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      setHealthStatus({ error: "백엔드 서버에 연결할 수 없습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* 히어로 섹션 */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              스위치온 다이어트 챌린지 진행중
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            함께하면 더 쉬운{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              다이어트
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            간헐적 단식과 식단 인증으로 건강한 습관을 만들어보세요.
            <br />
            잔디를 심듯이 매일 미션을 완료하고 성장을 확인하세요.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/challenges"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
            >
              챌린지 참여하기
            </Link>
            <Link
              href="/challenges"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              더 알아보기
            </Link>
          </div>
        </section>

        {/* 활동 히트맵 */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  나의 다이어트 기록
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  매일 미션을 완료하고 달력을 채워보세요
                </p>
              </div>
            </div>
            <MonthlyHeatmap />
          </div>
        </section>

        {/* 오늘의 미션 */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            오늘의 미션
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 간헐적 단식 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                  진행중
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                간헐적 단식 16:8
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                16시간 단식, 8시간 식사 타임
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-emerald-600">12:00</span> ~{" "}
                  <span className="font-medium text-emerald-600">20:00</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    남은 시간
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    4시간 32분
                  </div>
                </div>
              </div>
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
            </div>

            {/* 식단 인증 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                  2/3 완료
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                식단 인증
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                오늘 먹은 식사를 인증하세요
              </p>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center border-2 border-emerald-500">
                  <div className="text-lg mb-1">🌅</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    아침
                  </div>
                </div>
                <div className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center border-2 border-emerald-500">
                  <div className="text-lg mb-1">☀️</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    점심
                  </div>
                </div>
                <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-emerald-400 transition-colors">
                  <div className="text-lg mb-1">🌙</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    저녁
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 서버 연결 테스트 */}
        <section className="mb-16">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              개발자 도구
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={checkHealth}
                disabled={loading}
                className="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {loading ? "확인 중..." : "백엔드 연결 확인"}
              </button>
              {healthStatus && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                    healthStatus.error
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {healthStatus.error ? (
                    <span>{healthStatus.error}</span>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>
                        {healthStatus.status} - {healthStatus.service}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Switch-On - 함께하는 다이어트 챌린지</p>
          <p className="mt-1">Phase 3 - Challenge System</p>
        </div>
      </footer>
    </div>
  );
}
