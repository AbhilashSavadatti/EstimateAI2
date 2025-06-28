import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showRegisterLink?: boolean;
  showLoginLink?: boolean;
}

const AuthLayout = ({ 
  children, 
  title, 
  description,
  showRegisterLink = false,
  showLoginLink = false,
}: AuthLayoutProps) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EstimateAI</span>
          </Link>
        </div>
        
        <Card className="w-full bg-white/80 backdrop-blur-md border border-gray-100 shadow-md rounded-xl overflow-hidden">
          <CardHeader className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          {(showRegisterLink || showLoginLink) && (
            <CardFooter className="flex flex-col space-y-2 border-t border-gray-100 pt-5 px-6 pb-6 text-sm">
              {showRegisterLink && (
                <div className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
                  </Link>
                </div>
              )}
              {showLoginLink && (
                <div className="text-center text-gray-600">
                  Already have an account?{" "}
                  <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;