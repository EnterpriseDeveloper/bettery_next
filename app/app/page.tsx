"use client";
import Navbar from "@/components/navbar";
import { useEffect } from "react";

export default function Page() {
  const fetchEvents = async (limit = 10, nextKey?: string) => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (nextKey) params.set("nextKey", nextKey);

    const res = await fetch(`/api/events?${params.toString()}`);

    if (!res.ok) {
      throw new Error("Failed to load events");
    }

    console.log(await res.json());
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar />
      <p>App</p>
    </div>
  );
}
