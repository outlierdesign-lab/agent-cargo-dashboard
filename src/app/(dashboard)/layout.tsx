import Sidebar from "@/components/dashboard/Sidebar";
import { ToastProvider } from "@/components/dashboard/Toast";
import { C } from "@/lib/tokens";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div style={{ minHeight: "100vh", background: C.bg }}>
        <Sidebar />
        <main
          style={{
            marginLeft: 220,
            minHeight: "100vh",
            padding: "30px 36px",
            animation: "pageIn 0.2s ease-out",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
