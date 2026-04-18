"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getChallenges, Challenge, isAuthenticated } from "@/lib/api";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await getChallenges();
      setChallenges(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "챌린지를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              챌린지 둘러보기
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              함께할 다이어트 챌린지를 찾아보세요
            </p>
          </div>
          {isAuthenticated() && (
            <Link
              href="/challenges/create"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
            >
              챌린지 만들기
            </Link>
          )}
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* 챌린지 목록 */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">🏃</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  아직 모집중인 챌린지가 없어요
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  첫 번째 챌린지를 만들어보세요!
                </p>
                {isAuthenticated() && (
                  <Link
                    href="/challenges/create"
                    className="inline-flex px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
                  >
                    챌린지 만들기
                  </Link>
                )}
              </div>
            ) : (
              challenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/challenges/${challenge.id}`}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                  {/* 상태 뱃지 */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                      모집중
                    </span>
                    {challenge.isParticipating && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                        참가중
                      </span>
                    )}
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {challenge.title}
                  </h3>

                  {/* 설명 */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {challenge.description}
                  </p>

                  {/* 정보 */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                      <span>기간</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(challenge.startDate)} ~ {formatDate(challenge.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                      <span>참가비</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {formatMoney(challenge.depositAmount)}원
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                      <span>참가자</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {challenge.currentParticipants} / {challenge.maxParticipants}명
                      </span>
                    </div>
                  </div>

                  {/* 진행바 */}
                  <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all"
                      style={{
                        width: `${(challenge.currentParticipants / challenge.maxParticipants) * 100}%`,
                      }}
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
