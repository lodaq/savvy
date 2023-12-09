import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <div className="min-h-screen md:flex-nowrap flex gap-1">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}
