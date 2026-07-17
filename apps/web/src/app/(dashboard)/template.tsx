import { DashboardShell } from "@/components/dashboard-shell";

export default function Template({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
