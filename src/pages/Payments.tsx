import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { usePGContext } from "@/context/PGContext";

const Payments = () => {
  const { selectedPG, payments: allPayments } = usePGContext();

  // Filter payments for selected PG
  const payments = useMemo(() =>
    allPayments.filter(payment => payment.pgId === selectedPG?.id),
    [allPayments, selectedPG]
  );

  // Calculate payment stats
  const totalCollected = useMemo(() =>
    payments
      .filter(p => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  const pendingPayments = useMemo(() =>
    payments.filter(p => p.status === "Pending"),
    [payments]
  );

  const overduePayments = useMemo(() =>
    payments.filter(p => p.status === "Overdue"),
    [payments]
  );

  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-success/10 text-success";
      case "Pending": return "bg-warning/10 text-warning";
      case "Overdue": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
        <p className="text-muted-foreground">
          {selectedPG ? `${selectedPG.name} - Payment tracking` : 'Select a property to view payments'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{totalCollected.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">Paid payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">₹{totalPending.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">{pendingPayments.length} payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">₹{totalOverdue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">{overduePayments.length} payments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Recent Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{payment.tenant}</h3>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Room {payment.room} • ₹{payment.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {payment.dueDate}
                    {payment.paidDate && ` • Paid: ${payment.paidDate}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {payment.status !== "Paid" && (
                    <Button size="sm">Record Payment</Button>
                  )}
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
