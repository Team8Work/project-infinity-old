import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  ArrowUp,
  ArrowDown,
  CreditCard,
  DollarSign,
  AlertCircle,
  Banknote,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

// Sample finance data for demonstration
const financialOverview = [
  { name: "Jan", income: 42000, expenses: 28000 },
  { name: "Feb", income: 52000, expenses: 32000 },
  { name: "Mar", income: 48000, expenses: 30000 },
  { name: "Apr", income: 61000, expenses: 35000 },
  { name: "May", income: 55000, expenses: 34000 },
  { name: "Jun", income: 67000, expenses: 38000 },
];

const paymentStatuses = {
  "paid": { color: "bg-secondary/10 text-secondary" },
  "pending": { color: "bg-warning/10 text-warning" },
  "overdue": { color: "bg-danger/10 text-danger" },
  "cancelled": { color: "bg-neutral-light/10 text-neutral-light" },
};

export default function Finances() {
  const [filter, setFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ["/api/payments"],
  });

  // Format and filter payments
  const formattedPayments = payments
    ? payments.map(payment => ({
        ...payment,
        formattedAmount: `$${(payment.amount / 100).toLocaleString()}`,
        formattedDueDate: payment.dueDate ? format(new Date(payment.dueDate), 'MMM dd, yyyy') : 'N/A',
        formattedPaymentDate: payment.paymentDate ? format(new Date(payment.paymentDate), 'MMM dd, yyyy') : 'N/A',
      }))
    : [];

  const filteredPayments = formattedPayments
    ? formattedPayments.filter(payment => {
        const matchesFilter = filter
          ? (payment.shipmentId?.toString().includes(filter) ||
              payment.amount?.toString().includes(filter))
          : true;

        const matchesStatus = paymentStatus !== "all"
          ? payment.status === paymentStatus
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
          <h2 className="text-xl font-bold">Error loading financial data</h2>
          <p className="text-neutral-light">Please try again or contact support</p>
        </div>
      </AppShell>
    );
  }

  // Calculate financial summary
  const totalPending = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = filteredPayments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppShell>
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Finances</h1>
            <p className="text-neutral-light">Manage payments, invoices, and financial reports</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              <Download size={16} className="mr-2" />
              Export Report
            </Button>
            <Button>
              <Plus size={16} className="mr-2" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-neutral-light text-sm">Total Pending</p>
                  <h3 className="text-2xl font-semibold mt-2">${(totalPending / 100).toLocaleString()}</h3>
                  <p className="text-warning text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />
                    <span>Due within 30 days</span>
                  </p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center text-warning">
                  <CreditCard size={18} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-neutral-light text-sm">Total Paid</p>
                  <h3 className="text-2xl font-semibold mt-2">${(totalPaid / 100).toLocaleString()}</h3>
                  <p className="text-secondary text-sm flex items-center mt-1">
                    <ArrowUp size={14} className="mr-1" />
                    <span>8.2% from last month</span>
                  </p>
                </div>
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <Banknote size={18} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-neutral-light text-sm">Total Overdue</p>
                  <h3 className="text-2xl font-semibold mt-2">${(totalOverdue / 100).toLocaleString()}</h3>
                  <p className="text-danger text-sm flex items-center mt-1">
                    <ArrowDown size={14} className="mr-1" />
                    <span>Requires immediate action</span>
                  </p>
                </div>
                <div className="w-10 h-10 bg-danger/10 rounded-full flex items-center justify-center text-danger">
                  <AlertTriangle size={18} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-neutral-light text-sm">Revenue</p>
                  <h3 className="text-2xl font-semibold mt-2">${((totalPaid + totalPending) / 100).toLocaleString()}</h3>
                  <p className="text-secondary text-sm flex items-center mt-1">
                    <ArrowUp size={14} className="mr-1" />
                    <span>5.3% growth</span>
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <DollarSign size={18} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Charts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>
              Monthly income and expenses overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Chart
                type="bar"
                data={financialOverview}
                xDataKey="name"
                series={[
                  {
                    dataKey: "income",
                    name: "Income",
                    color: "hsl(var(--secondary))"
                  },
                  {
                    dataKey: "expenses",
                    name: "Expenses",
                    color: "hsl(var(--warning))"
                  }
                ]}
                className="h-full"
                options={{
                  grid: true,
                  legend: true,
                  tooltip: true,
                  xAxis: true,
                  yAxis: true,
                  formatter: (value) => `$${value.toLocaleString()}`
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Management */}
        <Tabs defaultValue="all-payments" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all-payments">All Payments</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="damage-claims">Damage Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="all-payments">
            <Card>
              <CardHeader className="pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>Payment Management</CardTitle>
                  <CardDescription>
                    View and manage all payments
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Input
                      placeholder="Search payments..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                  </div>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shipment ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length > 0 ? (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">#{payment.shipmentId}</TableCell>
                            <TableCell>{payment.formattedAmount}</TableCell>
                            <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                            <TableCell>{payment.formattedDueDate}</TableCell>
                            <TableCell>{payment.formattedPaymentDate}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatuses[payment.status]?.color}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">View details</span>
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
                                    className="h-4 w-4"
                                  >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Edit</span>
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
                                    className="h-4 w-4"
                                  >
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                  </svg>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No payments found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {filteredPayments.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-neutral-light">
                      Showing {filteredPayments.length} of {payments.length} payments
                    </p>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="bg-primary text-white">
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-neutral-light mb-4"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <h3 className="text-lg font-medium mb-2">No Invoices Available</h3>
                  <p className="text-neutral-light max-w-md mb-4">
                    The invoice management system is coming soon. You'll be able to create, send, and track invoices from here.
                  </p>
                  <Button>Generate Invoice</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="damage-claims">
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-neutral-light mb-4"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <h3 className="text-lg font-medium mb-2">No Damage Claims</h3>
                  <p className="text-neutral-light max-w-md mb-4">
                    All damage claims will be displayed here. You can review, process, and manage reimbursements from this section.
                  </p>
                  <Button>File Damage Claim</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
