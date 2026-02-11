"use client";
import Navbar from "@/components/navbar";
import { useState } from "react";
import { txCreateEvent } from "@/tx/events";
import { useWalletStore } from "../../store/useWalletStore";

export default function Page() {
  const { address, signer } = useWalletStore();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", ""]);
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Market");

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const epochEndDate = new Date(endDate).getTime();
    console.log({
      question,
      answers,
      epochEndDate,
      category,
    });
    const txResp = await txCreateEvent(signer!, address!, {
      creator: address!,
      question,
      answers,
      end_time: epochEndDate,
      category,
    });
    console.log("Transaction response:", txResp);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4" style={{ marginTop: 40 }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm/6 font-medium text-white">
              Question:
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              required
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label
                className="block text-sm/6 font-medium text-white"
                style={{ position: "relative", top: 15 }}
              >
                Answers:
              </label>
              <button
                style={{ marginBottom: 10 }}
                type="button"
                onClick={handleAddAnswer}
                className="group flex h-10 w-10 select-none items-center justify-center rounded-lg border border-zinc-100 bg-white leading-8 text-zinc-950 shadow-[0_-1px_0_0px_#d4d4d8_inset,0_0_0_1px_#f4f4f5_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-50 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"
                aria-label="Change language"
              >
                <span className="flex items-center group-active:[transform:translate3d(0,1px,0)]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-zinc-950"
                  >
                    <path
                      d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>

            {answers.map((answer, index) => (
              <div
                key={index}
                className="flex space-x-2"
                style={{ marginBottom: 15 }}
              >
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  required
                />
                {answers.length > 2 && (
                  <button
                    onClick={() =>
                      setAnswers(answers.filter((_, i) => i !== index))
                    }
                    className="group bg-red-500 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-2 font-medium text-neutral-200 transition hover:scale-110"
                  >
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M4 7h3m4 0h9" />
                      <path d="M10 11l0 6" />
                      <path d="M14 14l0 3" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l.077 -.923" />
                      <path d="M18.384 14.373l.616 -7.373" />
                      <path d="M9 5v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                      <div className="relative h-full w-8 bg-white/20"></div>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-white">
              End Date:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              required
            />
          </div>
          <div>
            <label className="blblock text-sm/6 font-medium text-whiteock">
              Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            >
              <option value="Market">Market</option>
              <option value="Sport">Sport</option>
              <option value="Politics">Politics</option>
            </select>
          </div>
          <button
            type="submit"
            className="group bg-blue-500 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md  px-6 font-medium text-neutral-200 transition hover:scale-110"
          >
            <span>Create event</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20"></div>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
