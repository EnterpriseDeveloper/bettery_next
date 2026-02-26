import { useState } from "react";

export default function Bridge({ setWithdrawal }: any) {
  const [amount, setAmount] = useState("0");
  const [receiver, setReceiver] = useState("");
  return (
    <div>
      <div>
        <label className="block text-sm/6 font-medium text-white">
          Receiver:
        </label>
        <input
          type="string"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          required
        />
        <label className="block text-sm/6 font-medium text-white">
          Amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          required
        />
      </div>
      <button
        onClick={() => setWithdrawal(receiver, amount)}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Withdrawal
      </button>
    </div>
  );
}
