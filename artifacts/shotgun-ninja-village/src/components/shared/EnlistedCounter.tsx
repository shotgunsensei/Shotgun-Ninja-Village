import { Activity } from "lucide-react";
import { useGetSignupsCount } from "@workspace/api-client-react";

/**
 * Live enlisted-operator counter. Renders nothing while loading or when
 * the count endpoint fails, so a backend outage never breaks the page.
 */
export function EnlistedCounter() {
  const { data: signups } = useGetSignupsCount();

  if (!signups) return null;

  return (
    <div
      data-testid="enlisted-counter"
      className="font-mono text-[10px] text-primary/70 uppercase tracking-widest bg-primary/5 px-2 py-0.5 border border-primary/20"
    >
      <Activity size={10} className="inline mr-1 animate-pulse" />{" "}
      {signups.count.toLocaleString()} Operators Enlisted
    </div>
  );
}
