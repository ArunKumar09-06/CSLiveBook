import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageTransition className="flex-1 flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
            Error 404 &bull; Page Not Found
          </span>
          <h1 className="font-display text-3xl font-bold text-white">
            Lost in the Space Aurora?
          </h1>
          <p className="text-sm text-[#A9B1D6]">
            The requested concept or page does not exist or has been relocated within the curriculum.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-4">
          <Link to="/">
            <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
              Return Home
            </Button>
          </Link>
          <Link to="/design">
            <Button variant="secondary">
              Design Showcase
            </Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};
