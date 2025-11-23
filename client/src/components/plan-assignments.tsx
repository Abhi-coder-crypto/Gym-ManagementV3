import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Dumbbell, UtensilsCrossed, Mail, UserPlus, Copy, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AssignPlanDialog } from "@/components/assign-plan-dialog";

export function PlanAssignments() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const { data: assignments = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/diet-plan-assignments'],
  });

  const cloneMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: string }) => {
      const endpoint = type === 'diet' 
        ? `/api/diet-plans/${id}/clone`
        : type === 'workout'
        ? `/api/workout-plan-templates/${id}/clone`
        : `/api/meals/${id}/clone`;
      return apiRequest("POST", endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/diet-plan-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/diet-plan-templates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workout-plan-templates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/meals'] });
      toast({ title: "Success", description: "Plan cloned successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/diet-plan-assignments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/diet-plan-assignments'] });
      toast({ title: "Success", description: "Assignment removed successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredAssignments = assignments.filter((assignment) => {
    const query = searchQuery.toLowerCase();
    return (
      assignment.clientName?.toLowerCase().includes(query) ||
      assignment.clientEmail?.toLowerCase().includes(query) ||
      assignment.dietPlanName?.toLowerCase().includes(query) ||
      assignment.workoutPlanName?.toLowerCase().includes(query)
    );
  });

  const handleReassign = (assignment: any) => {
    setSelectedAssignment(assignment);
    setAssignDialogOpen(true);
  };

  const handleClonePlan = (assignment: any, planType: 'diet' | 'workout') => {
    const planId = planType === 'diet' ? assignment.dietPlanId : assignment.workoutPlanId;
    if (planId) {
      cloneMutation.mutate({ id: planId, type: planType });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, email, or plan name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-assignments"
          />
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredAssignments.length} {filteredAssignments.length === 1 ? 'Assignment' : 'Assignments'}
        </Badge>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading assignments...</div>
      ) : filteredAssignments.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-semibold">No assignments found</p>
          <p className="text-sm text-muted-foreground mt-2">
            {searchQuery ? 'Try adjusting your search criteria' : 'Assign plans to clients to see them here'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment._id} data-testid={`card-assignment-${assignment._id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-2">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate" data-testid={`text-client-name-${assignment._id}`}>
                      {assignment.clientName}
                    </h3>
                    {assignment.clientEmail && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{assignment.clientEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {/* Diet Plan Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground text-xs">Diet Plan:</span>
                  </div>
                  {assignment.dietPlanName ? (
                    <Badge variant="default" className="w-full justify-center">
                      {assignment.dietPlanName}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="w-full justify-center text-muted-foreground">
                      Not Assigned
                    </Badge>
                  )}
                </div>

                {/* Workout Plan Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground text-xs">Workout Plan:</span>
                  </div>
                  {assignment.workoutPlanName ? (
                    <Badge variant="default" className="w-full justify-center">
                      {assignment.workoutPlanName}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="w-full justify-center text-muted-foreground">
                      Not Assigned
                    </Badge>
                  )}
                </div>

                {/* 2x2 Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleReassign(assignment)}
                    data-testid={`button-assign-${assignment._id}`}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Reassign
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (assignment.dietPlanId) {
                        handleClonePlan(assignment, 'diet');
                      } else if (assignment.workoutPlanId) {
                        handleClonePlan(assignment, 'workout');
                      }
                    }}
                    disabled={!assignment.dietPlanId && !assignment.workoutPlanId}
                    data-testid={`button-clone-${assignment._id}`}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReassign(assignment)}
                    data-testid={`button-edit-${assignment._id}`}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteMutation.mutate(assignment._id)}
                    data-testid={`button-delete-${assignment._id}`}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AssignPlanDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        plan={selectedAssignment}
      />
    </div>
  );
}
