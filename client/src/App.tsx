import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <div className="p-5 min-h-screen w-full md:flex-nowrap flex">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}
