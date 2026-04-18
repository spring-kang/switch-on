"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  getChallenge,
  getParticipants,
  joinChallenge,
  leaveChallenge,
  getMissions,
  Challenge,
  Participant,
  Mission,
  isAuthenticated,
  getStoredUser,
} from "@/lib/api";
import MissionCard from "@/components/MissionCard";

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      const [challengeData, participantsData] = await Promise.all([
        getChallenge(Number(id)),
        getParticipants(Number(id)),
      ]);
      setChallenge(challengeData);
      setParticipants(participantsData);

      // 참가중이면 미션도 로드
      if (challengeData.isParticipating) {
        const missionsData = await getMissions(Number(id));
        setMissions(missionsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "챌린지를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const loadMissions = async () => {
    try {
      const missionsData = await getMissions(Number(id));
      setMissions(missionsData);
    } catch (err) {
      console.error("미션 로드 실패:", err);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    try {
      setJoining(true);
      await joinChallenge(Number(id));
      await loadChallenge();
    } catch (err) {
      alert(err instanceof Error ? err.message : "참가에 실패했습니다");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("정말 챌린지에서 탈퇴하시겠습니까? 참가비는 환불됩니다.")) {
      return;
    }

    try {
      setJoining(true);
      await leaveChallenge(Number(id));
      await loadChallenge();
    } catch (err) {
      alert(err instanceof Error ? err.message : "탈퇴에 실패했습니다");
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const getDaysUntilStart = () => {
    if (!challenge) return 0;
    const start = new Date(challenge.startDate);
    const now = new Date();
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getChallengeDuration = () => {
    if (!challenge) return 0;
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-700 dark:text-red-300 mb-4">
              {error || "챌린지를 찾을 수 없습니다"}
            </p>
            <Link
              href="/challenges"
              className="inline-flex px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
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

        {/* 챌린지 헤더 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-full">
                  모집중
                </span>
                {challenge.isParticipating && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                    참가중
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {challenge.title}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">참가비</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatMoney(challenge.depositAmount)}원
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-wrap">
            {challenge.description}
          </p>

          {/* 챌린지 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">시작일</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatDate(challenge.startDate)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">종료일</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatDate(challenge.endDate)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">기간</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {getChallengeDuration()}일
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">시작까지</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                D-{getDaysUntilStart()}
              </div>
            </div>
          </div>

          {/* 참가자 현황 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">참가자 현황</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {challenge.currentParticipants} / {challenge.maxParticipants}명
              </span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all"
                style={{
                  width: `${(challenge.currentParticipants / challenge.maxParticipants) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* 참가/탈퇴 버튼 */}
          <div className="flex gap-3">
            {challenge.isParticipating ? (
              <button
                onClick={handleLeave}
                disabled={joining}
                className="flex-1 px-6 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                {joining ? "처리중..." : "탈퇴하기"}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining || challenge.currentParticipants >= challenge.maxParticipants}
                className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 disabled:shadow-none"
              >
                {joining
                  ? "처리중..."
                  : challenge.currentParticipants >= challenge.maxParticipants
                  ? "모집 완료"
                  : `${formatMoney(challenge.depositAmount)}원 내고 참가하기`}
              </button>
            )}
          </div>
        </div>

        {/* 오늘의 미션 (참가중일 때만) */}
        {challenge.isParticipating && missions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              오늘의 미션
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  challengeId={Number(id)}
                  onComplete={loadMissions}
                />
              ))}
            </div>
          </div>
        )}

        {/* 참가자 목록 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            참가자 ({participants.length}명)
          </h2>

          {participants.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              아직 참가자가 없습니다. 첫 번째 참가자가 되어보세요!
            </p>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-medium">
                      {participant.nickname.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {participant.nickname}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(participant.joinedAt).toLocaleDateString("ko-KR")} 참가
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      달성률 {participant.achievementRate}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {participant.depositStatus === "PAID" ? "결제완료" : participant.depositStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
