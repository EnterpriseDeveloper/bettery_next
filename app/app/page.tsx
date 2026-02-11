"use client";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";

export default function Page() {
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

  const handleSubmitAnswer = (eventId: number) => {
    const answerIndex = selected[eventId];
    const ev = events.find((e) => e.id === eventId);
    if (ev && (answerIndex === 0 || answerIndex)) {
      const payload = {
        eventId,
        selectedAnswer: ev.answers[answerIndex],
        selectedIndex: answerIndex,
      };
      console.log("Picked answer:", payload);
      // TODO: send to backend if needed
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
          <div key={ev.id} className="border rounded p-4">
            <div className="mb-2">
              <div className="text-lg font-medium">{ev.question}</div>
              <div className="text-xs text-gray-500">
                Category: {ev.category}
              </div>
            </div>

            <div className="space-y-2">
              {ev.answers.map((ans: string, idx: number) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`answer-${ev.id}`}
                    checked={selected[ev.id] === idx}
                    onChange={() => handleSelect(ev.id, idx)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm">{ans}</span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={() => handleSubmitAnswer(ev.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Pick Answer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
