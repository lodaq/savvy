import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';

export default function App() {
  return (
    <div className="p-5 min-h-screen w-full md:flex-nowrap bg-slate-500 flex">
      <Navbar />
      <Outlet />
    </div>
  );
}
