interface Props {
  form: ('W' | 'L' | 'NR')[];
}

export default function FormGuide({ form }: Props) {
  if (form.length === 0) {
    return <span className="text-xs text-gray-500">-</span>;
  }

  const getColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500 text-white border-green-600';
      case 'L': return 'bg-red-500 text-white border-red-600';
      case 'NR': return 'bg-gray-500 text-white border-gray-600';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {form.map((result, i) => (
        <div
          key={i}
          className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-black border ${getColor(result)}`}
          title={result}
        >
          {result}
        </div>
      ))}
    </div>
  );
}
