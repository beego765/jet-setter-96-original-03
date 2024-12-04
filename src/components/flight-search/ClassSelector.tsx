interface ClassSelectorProps {
  value: "economy" | "business" | "first";
  onChange: (value: "economy" | "business" | "first") => void;
  onComplete?: () => void;
}

export const ClassSelector = ({ value, onChange, onComplete }: ClassSelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as "economy" | "business" | "first");
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Class</label>
      <select
        value={value}
        onChange={handleChange}
        className="w-full h-12 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <option value="economy">Economy</option>
        <option value="business">Business</option>
        <option value="first">First</option>
      </select>
    </div>
  );
};