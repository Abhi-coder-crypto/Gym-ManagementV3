import { useState } from "react";
import { ClientHeader } from "@/components/client-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ClientBodyMeasurements() {
  const { toast } = useToast();
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    shoulders: "",
  });

  const { data: measurementsData, isLoading } = useQuery({
    queryKey: ['/api/progress/measurements'],
  });

  const addMeasurementMutation = useMutation({
    mutationFn: async (data: any) =>
      apiRequest('POST', '/api/progress/measurements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress/measurements'] });
      toast({ title: "Measurements logged successfully" });
      setMeasurements({
        chest: "",
        waist: "",
        hips: "",
        shoulders: "",
      });
    },
    onError: () => {
      toast({ title: "Failed to log measurements", variant: "destructive" });
    },
  });

  const handleLogMeasurements = () => {
    const validMeasurements = Object.entries(measurements)
      .filter(([_, value]) => value && !isNaN(parseFloat(value)))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: parseFloat(value) }), {});

    if (Object.keys(validMeasurements).length === 0) {
      toast({ title: "Please enter at least one measurement", variant: "destructive" });
      return;
    }

    addMeasurementMutation.mutate({
      ...validMeasurements,
      date: new Date().toISOString(),
    });
  };

  const current = measurementsData?.current || {};
  const previous = measurementsData?.previous || {};

  const measurementFields = [
    { key: 'chest', label: 'Chest', unit: 'cm' },
    { key: 'waist', label: 'Waist', unit: 'cm' },
    { key: 'hips', label: 'Hips', unit: 'cm' },
    { key: 'shoulders', label: 'Shoulders', unit: 'cm' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ClientHeader currentPage="body-measurements" />
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Body Measurements</h1>
          <p className="text-muted-foreground">Track changes in your body measurements over time</p>
        </div>

        {current && Object.keys(current).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Measurements</CardTitle>
              <CardDescription>
                Last updated: {current.date ? format(new Date(current.date), 'PPP') : 'Not recorded'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {measurementFields.map(({ key, label, unit }) => {
                  const currentValue = current[key];
                  const previousValue = previous[key];
                  const change = currentValue && previousValue ? currentValue - previousValue : null;

                  if (!currentValue) return null;

                  return (
                    <div key={key} className="p-4 rounded-md border" data-testid={`measurement-${key}`}>
                      <div className="text-sm text-muted-foreground mb-1">{label}</div>
                      <div className="text-2xl font-bold mb-1">
                        {currentValue} {unit}
                      </div>
                      {change !== null && (
                        <div className={`flex items-center gap-1 text-sm ${change < 0 ? 'text-green-500' : change > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {change < 0 ? (
                            <>
                              <TrendingDown className="h-3 w-3" />
                              {Math.abs(change).toFixed(1)} {unit}
                            </>
                          ) : change > 0 ? (
                            <>
                              <TrendingUp className="h-3 w-3" />
                              +{change.toFixed(1)} {unit}
                            </>
                          ) : (
                            'No change'
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Log New Measurements
            </CardTitle>
            <CardDescription>Enter your current body measurements in centimeters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {measurementFields.map(({ key, label, unit }) => (
                <div key={key}>
                  <Label htmlFor={key}>{label} ({unit})</Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.1"
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={measurements[key as keyof typeof measurements]}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, [key]: e.target.value })
                    }
                    data-testid={`input-${key}`}
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={handleLogMeasurements}
              disabled={addMeasurementMutation.isPending}
              className="w-full"
              data-testid="button-log-measurements"
            >
              <Ruler className="h-4 w-4 mr-2" />
              {addMeasurementMutation.isPending ? "Logging..." : "Log Measurements"}
            </Button>
          </CardContent>
        </Card>

        {measurementsData?.history && measurementsData.history.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Measurement History</CardTitle>
              <CardDescription>Your recent body measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {measurementsData.history.slice(0, 5).map((entry: any, index: number) => (
                  <div key={index} className="p-4 rounded-md border" data-testid={`history-entry-${index}`}>
                    <div className="font-medium mb-3">
                      {format(new Date(entry.date), 'PPP')}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      {measurementFields.map(({ key, label, unit }) => {
                        if (!entry[key]) return null;
                        return (
                          <div key={key}>
                            <span className="text-muted-foreground">{label}:</span>{' '}
                            <span className="font-medium">{entry[key]} {unit}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
