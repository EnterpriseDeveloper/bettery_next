"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Users,
  Shield,
  Hash,
} from "lucide-react";
import Navbar from "@/components/block/navbar";
import { formatUnits } from "viem";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

/** Event shape from API (BigInts serialized as string) */
interface EventFromApi {
  id: string;
  question: string;
  answers: string[];
  answersPool: string[];
  startTime: string;
  endTime: string;
  category: string;
  status: string;
  roomId: string;
  creator: string;
  createdAt: string;
  bets: {
    id: string;
    creator: string;
    answer: string;
    amount: string;
    token: string;
    status: string;
  }[];
  validators: { id: string; creator: string; answer: string }[];
}

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<EventFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundEvent, setNotFoundEvent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { id } = await params;
      const res = await fetch(`/api/events/${id}`, { cache: "no-store" });
      if (cancelled) return;
      if (!res.ok) {
        setNotFoundEvent(true);
        setLoading(false);
        return;
      }
      const eventData = await res.json();
      setEvent(eventData);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading event…</div>
      </div>
    );
  }

  if (notFoundEvent || !event) {
    notFound();
  }

  const totalPool = event.answersPool.reduce<bigint>(
    (sum, pool) => sum + BigInt(pool),
    0n,
  );

  const formatDate = (timestamp: bigint | string) => {
    const n =
      typeof timestamp === "string" ? Number(timestamp) : Number(timestamp);
    return new Date(n * 1000).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-[#2ecc71]/20 text-[#2ecc71]";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "resolved":
        return "bg-cyan/20 text-cyan";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 animated-gradient opacity-50" />
      <div className="absolute inset-0 pixel-pattern" />

      <div className="relative container mx-auto px-4 py-8">
        <Navbar />

        <Link href="/app">
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {event.question}
                  </CardTitle>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(event.status)}`}
                  >
                    {event.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span>ID: {String(event.id)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple/20 text-purple">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Answers
                  </h3>
                  <div className="space-y-3">
                    {event.answers.map((answer, index) => {
                      const rawPool = event.answersPool[index];
                      const pool = rawPool != null ? BigInt(rawPool) : 0n;
                      const percentage =
                        totalPool > 0n ? Number((pool * 100n) / totalPool) : 0;

                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground font-medium">
                              {answer}
                            </span>
                            <span className="text-muted-foreground">
                              {percentage.toFixed(1)}% ({formatUnits(pool, 6)}{" "}
                              USDT)
                            </span>
                          </div>
                          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-purple rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-cyan" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Start Time
                      </p>
                      <p className="text-sm text-foreground font-medium">
                        {formatDate(event.startTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">End Time</p>
                      <p className="text-sm text-foreground font-medium">
                        {formatDate(event.endTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {event.bets.length > 0 && (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple" />
                    Participants ({event.bets.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.bets.slice(0, 10).map((bet) => (
                      <div
                        key={bet.id.toString()}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-purple" />
                          </div>
                          <div>
                            <p className="text-sm text-foreground font-mono">
                              {bet.creator.slice(0, 8)}...
                              {bet.creator.slice(-6)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Bet: {bet.answer}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-foreground font-semibold">
                            {formatUnits(BigInt(bet.amount), 6)} {bet.token}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bet.status}
                          </p>
                        </div>
                      </div>
                    ))}
                    {event.bets.length > 10 && (
                      <p className="text-center text-sm text-muted-foreground pt-2">
                        +{event.bets.length - 10} more participants
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Event Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Pool</span>
                  <span className="text-foreground font-bold text-lg">
                    {formatUnits(totalPool, 6)} USDT
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Participants</span>
                  <span className="text-foreground font-semibold">
                    {event.bets.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Validators</span>
                  <span className="text-foreground font-semibold">
                    {event.validators.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Room ID</span>
                  <span className="text-foreground font-mono text-sm">
                    {event.roomId.slice(0, 8)}...
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-4 h-4" />
                  Creator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-mono text-sm break-all">
                  {event.creator}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Created: {event.createdAt.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {event.validators.length > 0 && (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-4 h-4 text-cyan" />
                    Validators ({event.validators.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.validators.slice(0, 5).map((validator) => (
                    <div
                      key={validator.id.toString()}
                      className="p-2 rounded bg-muted/50"
                    >
                      <p className="text-sm text-foreground font-mono">
                        {validator.creator.slice(0, 8)}...
                        {validator.creator.slice(-6)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Answer: {validator.answer}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
