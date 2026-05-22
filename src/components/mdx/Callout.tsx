interface CalloutProps {
  type?: "info" | "warn" | "tip" | "danger";
  children: React.ReactNode;
}

const styles: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  info: { bg: "bg-blue-50 dark:bg-blue-950/50", border: "border-blue-200 dark:border-blue-900", icon: "i", text: "text-blue-700 dark:text-blue-300" },
  warn: { bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-200 dark:border-amber-900", icon: "!", text: "text-amber-700 dark:text-amber-300" },
  tip: { bg: "bg-emerald-50 dark:bg-emerald-950/50", border: "border-emerald-200 dark:border-emerald-900", icon: "*", text: "text-emerald-700 dark:text-emerald-300" },
  danger: { bg: "bg-red-50 dark:bg-red-950/50", border: "border-red-200 dark:border-red-900", icon: "!", text: "text-red-700 dark:text-red-300" },
};

export function Callout({ type = "info", children }: CalloutProps) {
  const s = styles[type] ?? styles.info;
  return (
    <div className={`flex items-start gap-2.5 rounded-lg border ${s.border} ${s.bg} px-3.5 py-2.5 my-2`}>
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${s.text}`}>
        {s.icon}
      </span>
      <div className={`text-sm ${s.text}`}>{children}</div>
    </div>
  );
}
