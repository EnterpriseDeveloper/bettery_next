"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWalletStore } from "../../store/useWalletStore";
import {
  txIncreasePart,
  txParticipateEvent,
} from "@/blockchain/cosmos/participate";
import { refreshWalletBalance } from "@/lib/balance";
import { parseUnits } from "viem";
import type { Tab, StatusFilter, PendingZeroBet } from "./types";
import { fetchEventsList } from "./fetchEvents";

export function useEventsList() {
  const { address, signer } = useWalletStore();
  const [tab, setTab] = useState<Tab>("all");
  const [status, setStatus] = useState<StatusFilter | "">("ACTIVE");
  const [category, setCategory] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<number, number | null>>({});
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [zeroAmountModal, setZeroAmountModal] = useState<{
    open: boolean;
    pending: PendingZeroBet | null;
  }>({ open: false, pending: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreEvents, setNoMoreEvents] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEvents([]);
    setCurrentPage(1);
    setTotalPages(0);
    setNoMoreEvents(false);
    let cancelled = false;
    fetchEventsList(tab, status, category, address).then((result) => {
      if (!cancelled) {
        setEvents(result.events);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        if (result.totalPages > 0 && result.page >= result.totalPages) {
          setNoMoreEvents(true);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [tab, status, category, address]);

  const loadMore = useCallback(() => {
    if (loadingMore || totalPages === 0 || currentPage >= totalPages) return;
    setLoadingMore(true);
    fetchEventsList(tab, status, category, address, currentPage + 1)
      .then((result) => {
        setEvents((prev) => [...prev, ...result.events]);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        if (result.totalPages > 0 && result.page >= result.totalPages) {
          setNoMoreEvents(true);
        }
      })
      .finally(() => setLoadingMore(false));
  }, [tab, status, category, address, currentPage, totalPages, loadingMore]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleSelect = useCallback(
    (eventId: number | string, answerIndex: number) => {
      setSelected((s) => ({ ...s, [eventId]: answerIndex }));
    },
    [],
  );

  const handleSubmitAnswer = useCallback(
    async (eventId: number | string, amount: string, answerIndex: number) => {
      const ev = events.find((e) => String(e.id) === String(eventId));
      if (!ev || answerIndex < 0) return;
      const answer = ev.answers[answerIndex];
      if (!amount || Number(amount) <= 0) {
        setZeroAmountModal({ open: true, pending: { eventId, answerIndex } });
        return;
      }
      if (!signer || !address) return;
      const amountBigInt = parseUnits(amount, 6);
      await txParticipateEvent(
        signer,
        address,
        Number(eventId),
        answer,
        amountBigInt,
      );
      await refreshWalletBalance(address);
      const data = await fetchEventsList(tab, status, category, address);
      setEvents(data.events);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setNoMoreEvents(data.totalPages > 0 && data.page >= data.totalPages);
    },
    [events, tab, status, category, address, signer],
  );

  const handleIncreaseAnswer = useCallback(
    async (eventId: number | string, amount: string, partId: number) => {
      if (!signer || !address) return;
      const amountBigInt = parseUnits(amount, 6);
      await txIncreasePart(
        signer,
        address,
        partId,
        Number(eventId),
        amountBigInt,
      );
      await refreshWalletBalance(address);
      const data = await fetchEventsList(tab, status, category, address);
      setEvents(data.events);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setNoMoreEvents(data.totalPages > 0 && data.page >= data.totalPages);
    },
    [tab, status, category, address, signer],
  );

  const handleRefund = useCallback(
    async (_eventId: string | number) => {
      const data = await fetchEventsList(tab, status, category, address);
      setEvents(data.events);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setNoMoreEvents(data.totalPages > 0 && data.page >= data.totalPages);
    },
    [tab, status, category, address],
  );

  const handleProceedWithZero = useCallback(async () => {
    const { pending } = zeroAmountModal;
    if (!pending || !signer || !address) {
      setZeroAmountModal({ open: false, pending: null });
      return;
    }
    const ev = events.find((e) => String(e.id) === String(pending.eventId));
    const answer = ev?.answers[pending.answerIndex];
    if (!ev || answer == null) {
      setZeroAmountModal({ open: false, pending: null });
      return;
    }
    setZeroAmountModal({ open: false, pending: null });
    await txParticipateEvent(
      signer,
      address,
      Number(pending.eventId),
      answer,
      0n,
    );
    await refreshWalletBalance(address);
    const data = await fetchEventsList(tab, status, category, address);
    setEvents(data.events);
    setCurrentPage(data.page);
    setTotalPages(data.totalPages);
  }, [zeroAmountModal, events, tab, status, category, address, signer]);

  const closeZeroAmountModal = useCallback(() => {
    setZeroAmountModal({ open: false, pending: null });
  }, []);

  return {
    address,
    tab,
    setTab,
    status,
    setStatus,
    category,
    setCategory,
    categoryOpen,
    setCategoryOpen,
    events,
    selected,
    zeroAmountModal,
    loadMoreRef,
    loadingMore,
    noMoreEvents,
    handleSelect,
    handleSubmitAnswer,
    handleProceedWithZero,
    closeZeroAmountModal,
    handleIncreaseAnswer,
    handleRefund,
  };
}
