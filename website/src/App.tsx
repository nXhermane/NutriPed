import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage, MissionPage, TechnologyPage, TimelinePage, ContactPage, DownloadPage } from './pages';
import { PageLayout } from './components/layout/PageLayout';
import { AnimatePresence } from 'framer-motion';


const RootLayout = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
            <PageLayout key={location.pathname}>
                 <Outlet />
            </PageLayout>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/mission', element: <MissionPage /> },
      { path: '/technologie', element: <TechnologyPage /> },
      { path: '/timeline', element: <TimelinePage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/telecharger', element: <DownloadPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
