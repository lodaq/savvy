import { Outlet } from 'react-router-dom';
import Sidebar from './components/navbar';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <div className="min-h-screen md:flex-nowrap flex gap-1 min-w-[365px] w-full h-full">
      <Sidebar />
      <Outlet />
      <Toaster />
    </div>
  );
}
