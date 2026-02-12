"use client";
import EventCard from "@/components/block/event";
import Navbar from "@/components/block/navbar";
import { txParticipateEvent } from "@/tx/events";
import { useEffect, useState } from "react";
import { useWalletStore } from "../../store/useWalletStore";

export default function Page() {
  const { address, signer } = useWalletStore();

  const fetchEvents = async (limit = 10, nextKey?: string) => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (nextKey) params.set("nextKey", nextKey);

    const res = await fetch(`/api/events?${params.toString()}`);

    if (!res.ok) {
      throw new Error("Failed to load events");
    }

    const data = await res.json();
    console.log(data);
    setEvents(data.events ?? []);
  };

  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<number, number | null>>({});

  const handleSelect = (eventId: number, answerIndex: number) => {
    setSelected((s) => ({ ...s, [eventId]: answerIndex }));
  };

  const handleSubmitAnswer = (eventId: number, amount: string) => {
    const answerIndex = selected[eventId];
    const ev = events.find((e) => e.id === eventId);
    if (ev && (answerIndex === 0 || answerIndex)) {
      const payload = {
        eventId,
        selectedAnswer: ev.answers[answerIndex],
      };
      console.log("Picked answer:", payload);
      const txResp = txParticipateEvent(
        signer!,
        address!,
        payload.eventId,
        payload.selectedAnswer,
        amount,
      );
    } else {
      alert("Please select an answer first");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-4">
      <Navbar />
      <h1 className="text-2xl font-semibold my-4">Events</h1>

      <div className="space-y-6">
        {events.length === 0 && (
          <p className="text-sm text-gray-500">No events found.</p>
        )}

        {events.map((ev) => (
          <EventCard
            key={ev.id}
            ev={ev}
            selected={selected}
            handleSelect={handleSelect}
            handleSubmitAnswer={handleSubmitAnswer}
          />
        ))}
      </div>
    </div>
  );
}
