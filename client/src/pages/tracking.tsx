import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import { Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [searchedId, setSearchedId] = useState("");

  const handleTrackingSearch = () => {
    if (trackingId.trim()) {
      setSearchedId(trackingId);
    }
  };

  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ["/api/shipments"],
    enabled: !!searchedId,
  });

  // Filter shipments by tracking ID
  const filteredShipment = searchedId 
    ? shipments?.find((shipment: any) => shipment.trackingId === searchedId)
    : null;

  return (
    <AppShell>
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Task Tracking</h2>
        </div>

        <div className="mt-6">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Track Your Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter task or tracking ID"
                  className="flex-1"
                />
                <Button onClick={handleTrackingSearch}>Track</Button>
              </div>

              {isLoading && searchedId && (
                <div className="flex justify-center mt-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center mt-8">
                  <AlertTriangle className="w-12 h-12 text-danger mb-2" />
                  <p className="text-danger">Error loading tracking data</p>
                </div>
              )}

              {searchedId && !isLoading && !filteredShipment && (
                <div className="mt-8 text-center">
                  <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p>No tasks or shipments found with ID: <strong>{searchedId}</strong></p>
                </div>
              )}

              {filteredShipment && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Tracking Details</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking ID</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{filteredShipment.trackingId}</TableCell>
                        <TableCell>{filteredShipment.origin}</TableCell>
                        <TableCell>{filteredShipment.destination}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              filteredShipment.status === "delivered"
                                ? "success"
                                : filteredShipment.status === "in-transit"
                                ? "secondary"
                                : filteredShipment.status === "delayed"
                                ? "warning"
                                : filteredShipment.status === "cancelled"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {filteredShipment.status.charAt(0).toUpperCase() + filteredShipment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(filteredShipment.dueDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Task Timeline</h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                      <ul className="space-y-4">
                        <TimelineItem 
                          title="Task Created" 
                          date={new Date(filteredShipment.createdAt).toLocaleDateString()} 
                          description="Task was created and added to the system"
                          status="complete"
                        />
                        <TimelineItem 
                          title="Processing Started" 
                          date={new Date(filteredShipment.createdAt).toLocaleDateString()} 
                          description="Task processing has begun"
                          status="complete"
                        />
                        <TimelineItem 
                          title="In Progress" 
                          date={new Date().toLocaleDateString()} 
                          description="Task is currently being worked on"
                          status={filteredShipment.status === "in-transit" || filteredShipment.status === "delivered" ? "complete" : "pending"}
                        />
                        <TimelineItem 
                          title="Task Completed" 
                          date={filteredShipment.status === "delivered" ? new Date().toLocaleDateString() : ""}
                          description="Task has been successfully completed"
                          status={filteredShipment.status === "delivered" ? "complete" : "pending"}
                        />
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">Export</Button>
              <Button>Contact Support</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

// Timeline component for tracking
function TimelineItem({ 
  title, 
  date, 
  description, 
  status 
}: { 
  title: string; 
  date: string; 
  description: string; 
  status: "complete" | "pending" | "in-progress" 
}) {
  return (
    <li className="ml-8 relative">
      <div className={`absolute -left-10 top-1 w-6 h-6 rounded-full border-2 ${
        status === "complete" ? "bg-primary border-primary" : 
        status === "in-progress" ? "bg-white border-primary" : 
        "bg-white border-neutral-light"
      }`}>
        {status === "complete" && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
      <div className="pb-4">
        <div className="flex items-baseline justify-between">
          <h4 className="font-medium text-base">{title}</h4>
          <span className="text-sm text-neutral-light">{date}</span>
        </div>
        <p className="text-sm text-neutral-light mt-1">{description}</p>
      </div>
    </li>
  );
}