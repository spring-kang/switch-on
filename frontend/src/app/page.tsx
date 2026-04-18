"use client";

import { useState } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-black p-8">
      <main className="flex flex-col items-center gap-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            Switch-On
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            함께하는 다이어트 챌린지
          </p>
        </div>

        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            서버 연결 테스트
          </h2>

          <button
            onClick={checkHealth}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "확인 중..." : "백엔드 연결 확인"}
          </button>

          {healthStatus && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                healthStatus.error
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              }`}
            >
              {healthStatus.error ? (
                <p className="text-red-600 dark:text-red-400">
                  {healthStatus.error}
                </p>
              ) : (
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">상태:</span>{" "}
                    <span className="text-green-600 dark:text-green-400">
                      {healthStatus.status}
                    </span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">서비스:</span>{" "}
                    {healthStatus.service}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">시간:</span>{" "}
                    {healthStatus.timestamp}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600">
          Phase 1: 프로젝트 초기 설정 완료
        </p>
      </main>
    </div>
  );
}
