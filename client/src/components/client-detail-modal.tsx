import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, TrendingUp, Activity, Dumbbell } from "lucide-react";

interface ClientDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    name: string;
    email: string;
    phone: string;
    package: string;
    status: string;
    joinDate: string;
  };
}

export function ClientDetailModal({ open, onOpenChange, client }: ClientDetailModalProps) {
  const progressData = [
    { date: "Week 1", weight: 185, workouts: 3 },
    { date: "Week 2", weight: 183, workouts: 4 },
    { date: "Week 3", weight: 181, workouts: 5 },
    { date: "Week 4", weight: 179, workouts: 4 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="font-display text-2xl">{client.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={client.status === "active" ? "bg-chart-3" : "bg-muted"}>
                  {client.status}
                </Badge>
                <Badge variant="outline">{client.package}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {client.joinDate}</span>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-3">
              <Button className="flex-1" data-testid="button-send-message">Send Message</Button>
              <Button variant="outline" className="flex-1" data-testid="button-change-package">Change Package</Button>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto text-chart-1 mb-2" />
                    <p className="text-2xl font-bold">34</p>
                    <p className="text-sm text-muted-foreground">Workouts Completed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Dumbbell className="h-8 w-8 mx-auto text-chart-2 mb-2" />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-chart-3 mb-2" />
                    <p className="text-2xl font-bold">-6 lbs</p>
                    <p className="text-sm text-muted-foreground">Weight Change</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressData.map((week, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-16">{week.date}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Weight: {week.weight} lbs</span>
                          <span className="text-muted-foreground">Workouts: {week.workouts}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(week.workouts / 7) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Diet Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan Name</span>
                    <span className="font-semibold">Weight Loss Plan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Calories</span>
                    <span className="font-semibold">1,800 cal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meals per Day</span>
                    <span className="font-semibold">4</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">Change Diet Plan</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Live Session Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <p className="font-semibold">Power Yoga Session</p>
                      <p className="text-sm text-muted-foreground">Nov 10, 2025 - Attended</p>
                    </div>
                    <Badge className="bg-chart-3">Completed</Badge>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <p className="font-semibold">HIIT Training</p>
                      <p className="text-sm text-muted-foreground">Nov 8, 2025 - Attended</p>
                    </div>
                    <Badge className="bg-chart-3">Completed</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Strength Building</p>
                      <p className="text-sm text-muted-foreground">Nov 6, 2025 - Missed</p>
                    </div>
                    <Badge variant="outline">Missed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
