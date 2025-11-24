import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TrainerSidebar } from "@/components/trainer-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Mail, Phone, Target, TrendingUp, AlertCircle, Calendar, MessageSquare, User, Heart, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@shared/schema";
import { useState } from "react";
import { hasFeature, getRemainingDays, FEATURE_LABELS } from "@/lib/featureAccess";

export default function TrainerClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const style = {
    "--sidebar-width": "16rem",
  };

  const { data: authData } = useQuery<any>({
    queryKey: ['/api/auth/me']
  });

  const user = authData?.user;
  const trainerId = user?._id?.toString() || user?.id;

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ['/api/trainers', trainerId, 'clients'],
    enabled: !!trainerId
  });

  const filteredClients = clients.filter((client: Client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setDetailsDialogOpen(true);
  };

  const handleMessage = (client: Client) => {
    if (client.phone) {
      const phoneNumber = client.phone.replace(/\D/g, '');
      const message = `Hello ${client.name}, this is your trainer from FitPro. How can I help you today?`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <TrainerSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-display font-bold tracking-tight">
                My Clients
              </h1>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{clients.length}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {clients.filter((c: Client) => c.status === 'active').length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">New This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {clients.filter((c: Client) => {
                        const created = new Date(c.createdAt);
                        const now = new Date();
                        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                      }).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center text-muted-foreground py-8">Loading clients...</p>
                  ) : filteredClients.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No clients found</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredClients.map((client: Client) => (
                        <Card key={client._id} className="hover-elevate">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                                {client.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{client.name}</h3>
                                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                                    {client.status}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-1.5 text-sm">
                                  {client.email && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Mail className="h-3.5 w-3.5" />
                                      <span className="truncate">{client.email}</span>
                                    </div>
                                  )}
                                  {client.phone && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Phone className="h-3.5 w-3.5" />
                                      <span>{client.phone}</span>
                                    </div>
                                  )}
                                  {client.goal && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Target className="h-3.5 w-3.5" />
                                      <span className="capitalize">{client.goal}</span>
                                    </div>
                                  )}
                                  {client.fitnessLevel && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <TrendingUp className="h-3.5 w-3.5" />
                                      <span className="capitalize">{client.fitnessLevel}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 mt-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex-1" 
                                    onClick={() => handleViewDetails(client)}
                                    data-testid={`button-view-${client._id}`}
                                  >
                                    View Details
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex-1" 
                                    onClick={() => handleMessage(client)}
                                    data-testid={`button-message-${client._id}`}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Message
                                  </Button>
                                </div>

                                {/* Package & Subscription Info */}
                                <div className="grid grid-cols-2 gap-2 py-2 border-t mt-3 pt-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Package</p>
                                    <p className="font-semibold text-sm">{(client as any).packageName || 'None'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Expires In</p>
                                    <p className={`font-semibold text-sm ${getRemainingDays((client as any).subscriptionEndDate) <= 7 ? 'text-yellow-600' : ''}`}>
                                      {getRemainingDays((client as any).subscriptionEndDate)} days
                                    </p>
                                  </div>
                                </div>

                                {/* Subscription Alerts */}
                                {getRemainingDays((client as any).subscriptionEndDate) <= 7 && getRemainingDays((client as any).subscriptionEndDate) > 0 && (
                                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded border border-yellow-200 dark:border-yellow-800 mt-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                    <p className="text-xs text-yellow-800 dark:text-yellow-200">Expiring soon</p>
                                  </div>
                                )}
                                {getRemainingDays((client as any).subscriptionEndDate) <= 0 && (
                                  <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-800 mt-2">
                                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                    <p className="text-xs text-red-800 dark:text-red-200">Subscription expired</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Client Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {selectedClient?.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedClient?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedClient?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <Tabs defaultValue="personal" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="health">Health & Fitness</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedClient.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>Phone</span>
                        </div>
                        <span className="font-semibold">{selectedClient.phone}</span>
                      </div>
                    )}
                    {selectedClient.email && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                        <span className="font-semibold">{selectedClient.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                      <Badge variant={selectedClient.status === 'active' ? 'default' : 'secondary'}>
                        {selectedClient.status}
                      </Badge>
                    </div>
                    {selectedClient.createdAt && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Member Since</span>
                        </div>
                        <span className="font-semibold">
                          {new Date(selectedClient.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="health" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Fitness Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedClient.goal && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span>Goal</span>
                        </div>
                        <span className="font-semibold capitalize">{selectedClient.goal}</span>
                      </div>
                    )}
                    {selectedClient.fitnessLevel && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span>Fitness Level</span>
                        </div>
                        <span className="font-semibold capitalize">{selectedClient.fitnessLevel}</span>
                      </div>
                    )}
                    {selectedClient.medicalConditions && selectedClient.medicalConditions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Heart className="h-4 w-4" />
                          <span>Medical Conditions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedClient.medicalConditions.map((condition: string, index: number) => (
                            <Badge key={index} variant="outline">{condition}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedClient.injuries && selectedClient.injuries.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <AlertCircle className="h-4 w-4" />
                          <span>Injuries</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedClient.injuries.map((injury: string, index: number) => (
                            <Badge key={index} variant="destructive">{injury}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscription" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Package</span>
                      <span className="font-semibold">{(selectedClient as any).packageName || 'None'}</span>
                    </div>
                    {(selectedClient as any).subscriptionEndDate && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Expires In</span>
                          <span className={`font-semibold ${getRemainingDays((selectedClient as any).subscriptionEndDate) <= 7 ? 'text-yellow-600' : ''}`}>
                            {getRemainingDays((selectedClient as any).subscriptionEndDate)} days
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Expiry Date</span>
                          <span className="font-semibold">
                            {new Date((selectedClient as any).subscriptionEndDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </>
                    )}
                    {getRemainingDays((selectedClient as any).subscriptionEndDate) <= 7 && getRemainingDays((selectedClient as any).subscriptionEndDate) > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded border border-yellow-200 dark:border-yellow-800">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">Subscription expiring soon - consider reaching out</p>
                      </div>
                    )}
                    {getRemainingDays((selectedClient as any).subscriptionEndDate) <= 0 && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800 dark:text-red-200">Subscription expired - contact client for renewal</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => handleMessage(selectedClient)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message on WhatsApp
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
