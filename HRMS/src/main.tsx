import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner';
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Navbar from './components/Navbar.tsx';
import Index from './pages/Index.tsx';


const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> 
      </main>
    </>
  );
};

const router = createBrowserRouter([
  {
    path : '/index',
    element : <AppLayout/>,
    children : [
      {index : true, element : <Index/>}
    ]
  },
 { path : '/', element : <Login/>}

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>,
)
