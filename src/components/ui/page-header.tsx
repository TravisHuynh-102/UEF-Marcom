import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-end justify-between border-b border-black/[0.06] dark:border-white/[0.06] px-10 py-7">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-apple-text)]">{title}</h1>
        {subtitle && <p className="mt-1 text-[13.5px] text-[var(--color-apple-subtle)]">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
