import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListPayments,
  useCreatePaymentRequest,
  useListServiceRequests,
  getListPaymentsQueryKey,
  getGetServiceRequestQueryKey,
  getGetDashboardSummaryQueryKey,
  getListAuditLogQueryKey,
} from "@workspace/api-client-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatUSD, PAYMENT_STATUS_COLOR } from "../utils";

export default function PaymentsTab() {
  const { data: payments = [], isLoading } = useListPayments();
  const { data: requests = [] } = useListServiceRequests({});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const create = useCreatePaymentRequest();

  const [serviceRequestId, setServiceRequestId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  async function submit() {
    const id = parseInt(serviceRequestId, 10);
    const dollars = parseFloat(amount);
    if (!id || !dollars || dollars <= 0 || !description) {
      toast({
        title: "Missing fields",
        description: "Pick a request, set amount and description.",
        variant: "destructive",
      });
      return;
    }
    try {
      const cents = Math.round(dollars * 100);
      const result = await create.mutateAsync({
        data: {
          serviceRequestId: id,
          amountCents: cents,
          currency: "usd",
          description,
        },
      });
      queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: getGetServiceRequestQueryKey(id),
      });
      queryClient.invalidateQueries({
        queryKey: getGetDashboardSummaryQueryKey(),
      });
      queryClient.invalidateQueries({ queryKey: getListAuditLogQueryKey() });

      if (result.status === "error" || !result.stripeCheckoutUrl) {
        toast({
          title: "Payment request created (draft)",
          description:
            result.errorMessage ??
            "Stripe is not configured yet. The request was saved as a draft.",
        });
      } else {
        toast({
          title: "Payment link created",
          description: "Share the link with the customer from the table below.",
        });
      }
      setAmount("");
      setDescription("");
    } catch (err) {
      toast({
        title: "Failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied" });
    } catch {
      toast({
        title: "Copy failed",
        description: "Copy this link manually.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Request payment</CardTitle>
            <CardDescription>
              Generates a Stripe Checkout link to share with the customer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="payReq">Service request</Label>
              <Select value={serviceRequestId} onValueChange={setServiceRequestId}>
                <SelectTrigger id="payReq" className="mt-2">
                  <SelectValue placeholder="Pick a request…" />
                </SelectTrigger>
                <SelectContent>
                  {requests.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      #{r.id} · {r.purchaserName} · {r.serviceTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
                placeholder="e.g. 1350.00"
              />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
                placeholder="e.g. Milestone 1 — engine survey"
              />
            </div>
            <Button
              disabled={create.isPending}
              onClick={submit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              {create.isPending ? "Creating…" : "Create payment request"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>
              Stripe Checkout links generated for customers.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>Loading…</TableCell>
                  </TableRow>
                ) : payments.length > 0 ? (
                  payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium">{p.purchaserName}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.purchaserEmail}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatUSD(p.amountCents)}
                      </TableCell>
                      <TableCell>
                        <div>{p.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(p.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={PAYMENT_STATUS_COLOR[p.status] ?? ""}
                        >
                          {p.status}
                        </Badge>
                        {p.errorMessage && (
                          <div className="text-xs text-destructive mt-1 max-w-xs">
                            {p.errorMessage}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {p.stripeCheckoutUrl ? (
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copy(p.stripeCheckoutUrl!)}
                            >
                              <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                            </Button>
                            <Button asChild size="sm" variant="ghost">
                              <a
                                href={p.stripeCheckoutUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      No payment requests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
