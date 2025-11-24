import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SessionReminders } from "@/components/session-reminders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Calendar, Video, UtensilsCrossed, User, ChevronDown, TrendingUp, Scale, Ruler, Trophy, FileText, Image, Menu, X, ArrowLeft, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import logoImage from "@assets/TWWLOGO_1763965276890.png";

interface ClientHeaderProps {
  currentPage?: 'dashboard' | 'workouts' | 'videos' | 'diet' | 'sessions' | 'history' | 'workout-history' | 'progress' | 'profile' | 'weight-tracking' | 'body-measurements' | 'weekly-completion' | 'achievements' | 'achievement-gallery' | 'personal-records' | 'monthly-reports' | 'goals' | 'calculators' | 'calendar' | 'messages' | 'support-tickets' | 'announcements' | 'forum';
}

export function ClientHeader({ currentPage }: ClientHeaderProps) {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const [location] = useLocation();
  
  const showBackButton = () => {
    return location !== "/client" && location !== "/client-access" && location !== "/";
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Back Button */}
          <div className="flex items-center gap-2">
            {showBackButton() && (
              <button 
                onClick={() => history.back()} 
                className="md:hidden p-2 hover-elevate active-elevate-2 rounded-md flex-shrink-0"
                data-testid="button-back-mobile"
              >
                <ArrowLeft className="h-6 w-6 text-foreground" />
              </button>
            )}
            <button 
              onClick={() => setLocation("/client-access")} 
              className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 flex-shrink-0"
              data-testid="button-logo-home"
            >
              <img src={logoImage} alt="FitPro" className="h-20 w-20 object-contain" />
              <span className="text-2xl font-display font-bold tracking-tight hidden sm:inline">FitPro</span>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            <Button 
              variant="ghost" 
              className={currentPage === 'dashboard' ? 'bg-accent' : ''} 
              onClick={() => setLocation("/client")}
              data-testid="link-dashboard"
            >
              {t('nav.dashboard')}
            </Button>

            <Button 
              variant="ghost" 
              className={currentPage === 'sessions' ? 'bg-accent' : ''} 
              onClick={() => setLocation("/client/sessions")}
              data-testid="link-sessions"
            >
              {t('nav.liveSessions')}
            </Button>

            <Button 
              variant="ghost" 
              className={currentPage === 'videos' ? 'bg-accent' : ''} 
              onClick={() => setLocation("/client/videos")}
              data-testid="link-videos"
            >
              {t('nav.videoLibrary')}
            </Button>

            <Button 
              variant="ghost" 
              className={currentPage === 'diet' ? 'bg-accent' : ''} 
              onClick={() => setLocation("/client/diet")}
              data-testid="link-diet"
            >
              Diet & Meal Plans
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={['weight-tracking', 'body-measurements', 'achievements', 'personal-records', 'monthly-reports', 'progress', 'goals'].includes(currentPage || '') ? 'bg-accent' : ''} data-testid="dropdown-progress">
                  {t('nav.progressAnalytics')}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuItem onClick={() => setLocation("/client/progress/weight-tracking")} className={currentPage === 'weight-tracking' ? 'bg-accent' : ''} data-testid="link-weight-tracking">
                  <Scale className="h-4 w-4 mr-2" />
                  {t('nav.weightTracking')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/client/progress/body-measurements")} className={currentPage === 'body-measurements' ? 'bg-accent' : ''} data-testid="link-body-measurements">
                  <Ruler className="h-4 w-4 mr-2" />
                  {t('nav.bodyMeasurements')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/client/progress/personal-records")} className={currentPage === 'personal-records' ? 'bg-accent' : ''} data-testid="link-personal-records">
                  <Trophy className="h-4 w-4 mr-2" />
                  {t('nav.personalRecords')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/client/progress-photos")} className={currentPage === 'progress-photos' ? 'bg-accent' : ''} data-testid="link-progress-photos">
                  <Image className="h-4 w-4 mr-2" />
                  {t('nav.progressPhotos')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/client/progress/monthly-reports")} className={currentPage === 'monthly-reports' ? 'bg-accent' : ''} data-testid="link-monthly-reports">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('nav.monthlyReports')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/client/calculators")} className={currentPage === 'calculators' ? 'bg-accent' : ''} data-testid="link-calculators">
                  <Calculator className="h-4 w-4 mr-2" />
                  Nutrition Calculators
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover-elevate active-elevate-2"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Icon Buttons */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            <SessionReminders />
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation("/client/profile")} 
              data-testid="button-profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t pt-4">
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${currentPage === 'dashboard' ? 'bg-accent' : ''}`}
              onClick={() => {
                setLocation("/client");
                setMobileMenuOpen(false);
              }}
              data-testid="link-dashboard-mobile"
            >
              {t('nav.dashboard')}
            </Button>

            <Button 
              variant="ghost" 
              className={`w-full justify-start ${currentPage === 'sessions' ? 'bg-accent' : ''}`}
              onClick={() => {
                setLocation("/client/sessions");
                setMobileMenuOpen(false);
              }}
              data-testid="link-sessions-mobile"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {t('nav.liveSessions')}
            </Button>

            <Button 
              variant="ghost" 
              className={`w-full justify-start ${currentPage === 'videos' ? 'bg-accent' : ''}`}
              onClick={() => {
                setLocation("/client/videos");
                setMobileMenuOpen(false);
              }}
              data-testid="link-videos-mobile"
            >
              <Video className="h-4 w-4 mr-2" />
              {t('nav.videoLibrary')}
            </Button>

            <Button 
              variant="ghost" 
              className={`w-full justify-start ${currentPage === 'diet' ? 'bg-accent' : ''}`}
              onClick={() => {
                setLocation("/client/diet");
                setMobileMenuOpen(false);
              }}
              data-testid="link-diet-mobile"
            >
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              {t('nav.nutrition')}
            </Button>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground px-2">{t('nav.progressAnalytics')}</p>
              <Button 
                variant="ghost" 
                className={`w-full justify-start pl-6 ${currentPage === 'weight-tracking' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setLocation("/client/progress/weight-tracking");
                  setMobileMenuOpen(false);
                }}
                data-testid="link-weight-tracking-mobile"
              >
                <Scale className="h-4 w-4 mr-2" />
                {t('nav.weightTracking')}
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start pl-6 ${currentPage === 'body-measurements' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setLocation("/client/progress/body-measurements");
                  setMobileMenuOpen(false);
                }}
                data-testid="link-body-measurements-mobile"
              >
                <Ruler className="h-4 w-4 mr-2" />
                {t('nav.bodyMeasurements')}
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start pl-6 ${currentPage === 'personal-records' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setLocation("/client/progress/personal-records");
                  setMobileMenuOpen(false);
                }}
                data-testid="link-personal-records-mobile"
              >
                <Trophy className="h-4 w-4 mr-2" />
                {t('nav.personalRecords')}
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start pl-6 ${currentPage === 'progress-photos' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setLocation("/client/progress-photos");
                  setMobileMenuOpen(false);
                }}
                data-testid="link-progress-photos-mobile"
              >
                <Image className="h-4 w-4 mr-2" />
                {t('nav.progressPhotos')}
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start pl-6 ${currentPage === 'monthly-reports' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setLocation("/client/progress/monthly-reports");
                  setMobileMenuOpen(false);
                }}
                data-testid="link-monthly-reports-mobile"
              >
                <FileText className="h-4 w-4 mr-2" />
                {t('nav.monthlyReports')}
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start pl-6 ${currentPage === 'calculators' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setLocation("/client/calculators");
                  setMobileMenuOpen(false);
                }}
                data-testid="link-calculators-mobile"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Nutrition Calculators
              </Button>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setLocation("/client/profile");
                  setMobileMenuOpen(false);
                }}
                data-testid="link-profile-mobile"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
