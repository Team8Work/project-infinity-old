import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import ShipmentTable from "@/components/shipments/shipment-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertTriangle, Plus, Filter, Calendar } from "lucide-react";
import { useState } from "react";

export default function Shipments() {
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("all");

  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ["/api/shipments"],
  });

  const filteredShipments = shipments 
    ? shipments.filter(shipment => {
        const matchesFilter = filter 
          ? (shipment.trackingId?.toLowerCase().includes(filter.toLowerCase()) ||
             shipment.origin?.toLowerCase().includes(filter.toLowerCase()) ||
             shipment.destination?.toLowerCase().includes(filter.toLowerCase()))
          : true;
        
        const matchesStatus = status !== "all" 
          ? shipment.status === status
          : true;
        
        return matchesFilter && matchesStatus;
      })
    : [];

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertTriangle className="w-12 h-12 text-danger mb-4" />
          <h2 className="text-xl font-bold">Error loading shipments data</h2>
          <p className="text-neutral-light">Please try again or contact support</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Shipments</h1>
            <p className="text-neutral-light">Manage and track all your shipments</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <Plus size={16} className="mr-2" />
              Create Shipment
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter shipments by status, date range, or search by ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Input
                    placeholder="Search by ID, origin, or destination"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-9"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light">
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
                      className="lucide lucide-search"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar size={16} className="mr-2" />
                  <span>Select date range</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg border border-border shadow-sm">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold">
              Shipments ({filteredShipments.length})
            </h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Advanced Filters
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
          
          <ShipmentTable
            shipments={filteredShipments}
            isLoading={isLoading}
            isDetailView={true}
          />
        </div>
      </div>
    </AppShell>
  );
}
