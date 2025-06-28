import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/MainLayout';
import { CheckIcon, MicIcon, ArrowRightIcon, BarChart3Icon, PieChartIcon, SparklesIcon, ClipboardListIcon, UsersIcon, MessageSquareTextIcon, FileTextIcon } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-[-1]" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="col-span-1 lg:col-span-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Create accurate estimates in minutes, not hours
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                EstimateAI helps contractors and remodelers create professional estimates faster using voice input and AI technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="text-base px-8">
                  <Link to="/auth/register">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <Link to="/features">See How It Works</Link>
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
                <span>No credit card required</span>
                <span>•</span>
                <span>14-day free trial</span>
                <span>•</span>
                <span>Cancel anytime</span>
              </div>
            </div>
            <div className="col-span-1 lg:col-span-2 relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/public/assets/dashboard-preview.jpg" 
                  alt="EstimateAI Dashboard" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="font-medium">Modern, intuitive interface</p>
                    <p className="text-sm opacity-80">Designed for contractors, by contractors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How EstimateAI Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform simplifies the estimation process from start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <MicIcon className="h-6 w-6 text-blue-700" />
                </div>
                <CardTitle>Voice Input</CardTitle>
                <CardDescription>
                  Describe your project out loud and let our system do the work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Simply speak your project details into EstimateAI. Our advanced speech recognition converts your voice into detailed project specs instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <SparklesIcon className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>AI Processing</CardTitle>
                <CardDescription>
                  Gemini AI technology breaks down project requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI analyzes your input to generate accurate material and labor estimates, identifying quantities and costs based on current market rates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <ClipboardListIcon className="h-6 w-6 text-green-700" />
                </div>
                <CardTitle>Professional Estimates</CardTitle>
                <CardDescription>
                  Generate polished, client-ready estimates in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Review the AI-generated estimate, make adjustments as needed, and create professional documents ready to share with clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Contractors Choose EstimateAI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save time, increase accuracy, and win more bids with our powerful estimation platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-blue-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save 80% of Time</h3>
                <p className="text-gray-600">
                  Create comprehensive estimates in minutes instead of hours with our AI-powered system and voice input technology.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-blue-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Increase Accuracy</h3>
                <p className="text-gray-600">
                  Reduce human error and ensure consistent pricing with AI that analyzes project requirements in detail.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-blue-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Improve Profit Margins</h3>
                <p className="text-gray-600">
                  Identify optimal pricing with profit analysis tools designed specifically for contractors and remodelers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-blue-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Win More Projects</h3>
                <p className="text-gray-600">
                  Present professional, detailed estimates that inspire confidence and help you stand out from competitors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Contractors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your estimation process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MicIcon className="h-6 w-6 text-blue-600 mb-2" />
                <CardTitle>Voice-to-Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Speak your project details and watch as they're transformed into detailed estimates in real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <UsersIcon className="h-6 w-6 text-blue-600 mb-2" />
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Store client information, project history, and communication in one organized system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileTextIcon className="h-6 w-6 text-blue-600 mb-2" />
                <CardTitle>Template Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access and customize industry-specific templates for common projects to save even more time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquareTextIcon className="h-6 w-6 text-blue-600 mb-2" />
                <CardTitle>Instant Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Send professional PDF estimates directly to clients with just a few clicks.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3Icon className="h-6 w-6 text-blue-600 mb-2" />
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Break down project costs by materials, labor, and profit margin to make informed decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <PieChartIcon className="h-6 w-6 text-blue-600 mb-2" />
                <CardTitle>Business Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track estimate conversion rates, profit margins, and other key metrics to grow your business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your estimation process?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of contractors who are saving time and winning more bids with EstimateAI.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-base px-8">
            <Link to="/auth/register">
              Start Your Free Trial <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-6 text-blue-100">No credit card required • 14-day free trial</p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;