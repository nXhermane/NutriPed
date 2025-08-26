import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

const navLinks = [
  { name: 'Contexte', href: '#context' },
  { name: 'Pédagogie', href: '#pedagogical' },
  { name: 'Technique', href: '#technical' },
  { name: 'Vision', href: '#vision' },
];

export const Navbar = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Set html smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        hasScrolled
          ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#home" className="text-xl font-bold text-white">
              Nutriped
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
