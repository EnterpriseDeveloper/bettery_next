"use client";

import Navbar from "@/components/block/navbar";
import BetModal from "@/components/modals/betModal";
import { categories } from "@/config/config";
import { useEventsList } from "./useEventsList";
import { EventsPageTabs } from "./EventsPageTabs";
import { EventsPageHeader } from "./EventsPageHeader";
import { CategoryDropdown } from "./CategoryDropdown";
import { EventsListSection } from "./EventsListSection";

export default function Page() {
  const {
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
    increaseStakeLoadingEventId,
  } = useEventsList();

  const categoryLabel = category
    ? (categories.find((c) => c.name === category)?.name ?? "All Categories")
    : "All Categories";

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900 dark:bg-[#0a0b10] dark:text-slate-100">
      <Navbar />

      <BetModal
        open={zeroAmountModal.open}
        onClose={closeZeroAmountModal}
        onProceed={handleProceedWithZero}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EventsPageTabs tab={tab} onTabChange={setTab} />

        <EventsPageHeader status={status} onStatusChange={setStatus} />

        <CategoryDropdown
          category={category}
          categoryLabel={categoryLabel}
          open={categoryOpen}
          onToggle={() => setCategoryOpen((o) => !o)}
          onSelect={(c) => {
            setCategory(c);
            setCategoryOpen(false);
          }}
        />

        <EventsListSection
          tab={tab}
          address={address}
          events={events}
          selected={selected}
          loadMoreRef={loadMoreRef}
          loadingMore={loadingMore}
          noMoreEvents={noMoreEvents}
          increaseStakeLoadingEventId={increaseStakeLoadingEventId}
          onSelect={handleSelect}
          onSubmitAnswer={handleSubmitAnswer}
          onIncreaseAnswer={handleIncreaseAnswer}
          onRefund={handleRefund}
        />
      </main>
    </div>
  );
}
