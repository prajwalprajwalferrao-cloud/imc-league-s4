interface Props {
  form: ('W' | 'L' | 'NR')[];
}

export default function FormGuide({ form }: Props) {
  if (!form || form.length === 0) {
    return <span className="text-xs text-gray-600 font-mono">-</span>;
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {form.map((result, i) => {
        const isWin = result === 'W';
        const isLoss = result === 'L';
        return (
          <span
            key={i}
            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black uppercase shadow-sm ${
              isWin
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : isLoss
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            {result}
          </span>
        );
      })}
    </div>
  );
}
