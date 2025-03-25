import React from 'react';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  // Show a welcome screen if user is not logged in
  if (!user && !loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
          <div className="p-4 rounded-full bg-primary/10 mb-6">
            <MessageSquare size={36} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Hostel Buddy</h1>
          <p className="text-xl text-muted-foreground max-w-md mb-8">
            Your intelligent assistant for all hostel-related concerns and support.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="px-6">
              <Link to="/login">
                Get Started <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ChatInterface />
    </Layout>
  );
};

export default Index;
