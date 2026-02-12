import { useState } from "react";

export default function EventCard({
  ev,
  selected,
  handleSelect,
  handleSubmitAnswer,
}: any) {
  const [amount, setAmount] = useState("0"); // TODO add minimum amount and validation

  return (
    <div key={ev.id} className="border rounded p-4">
      <div className="mb-2">
        <div className="text-lg font-medium">{ev.question}</div>
        <div className="text-xs text-gray-500">Category: {ev.category}</div>
      </div>

      <div className="space-y-2">
        {ev.answers.map((ans: string, idx: number) => (
          <label key={idx + idx} className="flex items-center space-x-2">
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
      <div>
        <label className="block text-sm/6 font-medium text-white">
          Bet amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          required
        />
      </div>

      <div className="mt-4">
        <button
          onClick={() => handleSubmitAnswer(ev.id, amount)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Pick Answer
        </button>
      </div>
    </div>
  );
}
