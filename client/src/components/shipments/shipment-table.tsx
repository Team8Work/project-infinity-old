import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shipment } from "@shared/schema";
import { format } from "date-fns";
import { Eye, Edit, Trash, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Status badge styles
const statusStyles = {
  "pending": { color: "bg-warning/10 text-warning" },
  "in-transit": { color: "bg-secondary/10 text-secondary" },
  "delivered": { color: "bg-gray-100 text-gray-600" },
  "delayed": { color: "bg-danger/10 text-danger" },
  "cancelled": { color: "bg-neutral-light/10 text-neutral-light" },
};

interface ShipmentTableProps {
  shipments: Shipment[];
  isLoading?: boolean;
  isDetailView?: boolean;
}

export default function ShipmentTable({ 
  shipments, 
  isLoading = false,
  isDetailView = false
}: ShipmentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(shipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShipments = shipments.slice(startIndex, endIndex);

  // Generate client initials for display
  const getClientInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-neutral-light">Loading shipments data...</p>
      </div>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-light">No shipments found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-background border-b border-border-color">
              <TableHead className="font-medium text-neutral-light">
                <div className="flex items-center">
                  Tracking ID
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-1"
                  >
                    <path d="m21 16-4 4-4-4"/>
                    <path d="M17 20V4"/>
                    <path d="m3 8 4-4 4 4"/>
                    <path d="M7 4v16"/>
                  </svg>
                </div>
              </TableHead>
              <TableHead className="font-medium text-neutral-light">
                <div className="flex items-center">
                  Origin
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-1"
                  >
                    <path d="m21 16-4 4-4-4"/>
                    <path d="M17 20V4"/>
                    <path d="m3 8 4-4 4 4"/>
                    <path d="M7 4v16"/>
                  </svg>
                </div>
              </TableHead>
              <TableHead className="font-medium text-neutral-light">
                <div className="flex items-center">
                  Destination
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-1"
                  >
                    <path d="m21 16-4 4-4-4"/>
                    <path d="M17 20V4"/>
                    <path d="m3 8 4-4 4 4"/>
                    <path d="M7 4v16"/>
                  </svg>
                </div>
              </TableHead>
              <TableHead className="font-medium text-neutral-light">
                <div className="flex items-center">
                  Client
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-1"
                  >
                    <path d="m21 16-4 4-4-4"/>
                    <path d="M17 20V4"/>
                    <path d="m3 8 4-4 4 4"/>
                    <path d="M7 4v16"/>
                  </svg>
                </div>
              </TableHead>
              <TableHead className="font-medium text-neutral-light">
                <div className="flex items-center">
                  Due Date
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-1"
                  >
                    <path d="m21 16-4 4-4-4"/>
                    <path d="M17 20V4"/>
                    <path d="m3 8 4-4 4 4"/>
                    <path d="M7 4v16"/>
                  </svg>
                </div>
              </TableHead>
              <TableHead className="font-medium text-neutral-light">
                <div className="flex items-center">
                  Status
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-1"
                  >
                    <path d="m21 16-4 4-4-4"/>
                    <path d="M17 20V4"/>
                    <path d="m3 8 4-4 4 4"/>
                    <path d="M7 4v16"/>
                  </svg>
                </div>
              </TableHead>
              <TableHead className="font-medium text-neutral-light">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentShipments.map((shipment) => (
              <TableRow key={shipment.id} className="border-b border-border-color hover:bg-background">
                <TableCell className="font-medium">{shipment.trackingId}</TableCell>
                <TableCell>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium mr-2">
                      {getClientInitials("Client Name" || "CN")}
                    </div>
                    Client #{shipment.clientId}
                  </div>
                </TableCell>
                <TableCell>{formatDate(shipment.dueDate)}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      statusStyles[shipment.status as keyof typeof statusStyles]?.color
                    )}
                  >
                    {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View details">
                      <Eye className="h-4 w-4 text-neutral-light hover:text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit shipment">
                      <Edit className="h-4 w-4 text-neutral-light hover:text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete shipment">
                      <Trash className="h-4 w-4 text-neutral-light hover:text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-5 border-t border-border-color flex items-center justify-between">
        <div className="text-sm text-neutral-light">
          Showing {currentShipments.length} of {shipments.length} entries
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="icon"
            className="w-8 h-8 p-0" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="icon"
              className="w-8 h-8 p-0"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            size="icon"
            className="w-8 h-8 p-0" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
