import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-gray-50 to-blue-50', className)}>
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EstimateAI</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link 
              to="/auth/login" 
              className="text-gray-800 hover:text-blue-600 transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/auth/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t border-gray-100 bg-white mt-auto py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">EstimateAI</h3>
              <p className="text-gray-600">AI-powered estimation for small contractors and remodelers.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link></li>
                <li><Link to="/testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors">Support</Link></li>
                <li><Link to="/documentation" className="text-gray-600 hover:text-blue-600 transition-colors">Documentation</Link></li>
                <li><Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Trikon Brickloop. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-500 text-sm hover:text-blue-600">Terms</Link>
              <Link to="/privacy" className="text-gray-500 text-sm hover:text-blue-600">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;