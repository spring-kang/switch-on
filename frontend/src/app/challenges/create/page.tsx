"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { createChallenge, isAuthenticated } from "@/lib/api";

export default function CreateChallengePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    maxParticipants: 10,
    depositAmount: 10000,
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && !isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "maxParticipants" || name === "depositAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!form.title.trim()) {
      setError("챌린지 제목을 입력해주세요");
      return;
    }
    if (!form.startDate || !form.endDate) {
      setError("시작일과 종료일을 선택해주세요");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("종료일은 시작일 이후여야 합니다");
      return;
    }

    try {
      setLoading(true);
      const challenge = await createChallenge(form);
      router.push(`/challenges/${challenge.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "챌린지 생성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* 뒤로가기 */}
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          챌린지 목록
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            새 챌린지 만들기
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            함께할 다이어트 챌린지를 만들어보세요
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                챌린지 제목
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="예: 4주 간헐적 단식 챌린지"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                챌린지 설명
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="챌린지 규칙, 목표, 주의사항 등을 작성해주세요"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* 기간 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* 인원 및 참가비 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  최대 참가 인원
                </label>
                <select
                  name="maxParticipants"
                  value={form.maxParticipants}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  {[5, 10, 15, 20, 30, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}명
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  참가비 (디파짓)
                </label>
                <select
                  name="depositAmount"
                  value={form.depositAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  {[5000, 10000, 20000, 30000, 50000, 100000].map((n) => (
                    <option key={n} value={n}>
                      {formatMoney(n)}원
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 안내 */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-2">
                참가비 안내
              </h3>
              <ul className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
                <li>• 참가비는 챌린지 시작 전까지 환불 가능합니다</li>
                <li>• 챌린지 완료 시 달성률에 따라 참가비가 정산됩니다</li>
                <li>• 현재는 Mock 결제로 처리됩니다</li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <Link
                href="/challenges"
                className="flex-1 px-6 py-3 text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50"
              >
                {loading ? "생성 중..." : "챌린지 만들기"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
