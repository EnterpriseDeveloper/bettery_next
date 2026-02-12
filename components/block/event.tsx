export default function EventCard({
  ev,
  selected,
  handleSelect,
  handleSubmitAnswer,
}: any) {
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

      <div className="mt-4">
        <button
          onClick={() => handleSubmitAnswer(ev.id)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Pick Answer
        </button>
      </div>
    </div>
  );
}
