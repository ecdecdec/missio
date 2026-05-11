import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const mockStudent = {
    name: "Аружан",
    grade: "11",
    school: "НИШ Алматы",
    profileComplete: 80,
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)]">
      <Sidebar student={mockStudent} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
