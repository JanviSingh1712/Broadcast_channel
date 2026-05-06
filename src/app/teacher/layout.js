import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Sidebar from '@/components/shared/Sidebar';

export default function TeacherLayout({ children }) {
  return (
    <ProtectedRoute role="teacher">
      <div className="flex min-h-screen bg-canvas">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
