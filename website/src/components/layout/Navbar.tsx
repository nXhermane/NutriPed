import { Link, NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Mission', href: '/mission' },
  { name: 'Technologie', href: '/technologie' },
  { name: 'Timeline', href: '/timeline' },
  { name: 'Contact', href: '/contact' },
];

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-white">
              Nutriped
            </Link>
          </div>
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    clsx(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'text-white bg-gray-700'
                        : 'text-gray-300 hover:text-white'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="hidden md:block">
             <Link to="/telecharger" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg">
                Télécharger
             </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                {isMenuOpen ? <X/> : <Menu/>}
            </button>
          </div>
        </div>
        {isMenuOpen && (
             <div className="md:hidden">
                <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                        <NavLink
                          key={link.name}
                          to={link.href}
                           onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            clsx(
                              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                              isActive
                                ? 'text-white bg-gray-700'
                                : 'text-gray-300 hover:text-white'
                            )
                          }
                        >
                          {link.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="pt-4 pb-3 border-t border-gray-700">
                    <Link to="/telecharger"  onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg">
                        Télécharger
                    </Link>
                </div>
             </div>
        )}
      </div>
    </header>
  );
};
