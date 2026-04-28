import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListServiceRequests,
  useGetServiceRequest,
  useUpdateServiceRequest,
  getListServiceRequestsQueryKey,
  getGetServiceRequestQueryKey,
  getGetDashboardSummaryQueryKey,
  getListAuditLogQueryKey,
} from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDate, formatUSD, STATUS_COLOR, PAYMENT_STATUS_COLOR } from "../utils";
import { useToast } from "@/hooks/use-toast";

const STATUSES = [
  "new",
  "reviewing",
  "contracted",
  "completed",
  "cancelled",
] as const;
type Status = (typeof STATUSES)[number];

export default function RequestsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  const queryParams =
    statusFilter === "all" ? {} : { status: statusFilter as Status };

  const {
    data: requests,
    isLoading,
  } = useListServiceRequests(queryParams);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary">Service requests</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : requests && requests.length > 0 ? (
                requests.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer">
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {r.purchaserName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {r.purchaserEmail}
                      </div>
                    </TableCell>
                    <TableCell>{r.serviceTitle}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(r.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_COLOR[r.status] ?? ""}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpenId(r.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    No requests yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={openId != null} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {openId != null && (
            <RequestDetail
              id={openId}
              onUpdated={() => {
                queryClient.invalidateQueries({
                  queryKey: getListServiceRequestsQueryKey(),
                });
                queryClient.invalidateQueries({
                  queryKey: getListServiceRequestsQueryKey(queryParams),
                });
                queryClient.invalidateQueries({
                  queryKey: getGetServiceRequestQueryKey(openId),
                });
                queryClient.invalidateQueries({
                  queryKey: getGetDashboardSummaryQueryKey(),
                });
                queryClient.invalidateQueries({
                  queryKey: getListAuditLogQueryKey(),
                });
                toast({ title: "Request updated" });
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RequestDetail({
  id,
  onUpdated,
}: {
  id: number;
  onUpdated: () => void;
}) {
  const { data, isLoading } = useGetServiceRequest(id);
  const update = useUpdateServiceRequest();
  const [status, setStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  if (isLoading || !data) {
    return (
      <SheetHeader>
        <SheetTitle>Loading…</SheetTitle>
      </SheetHeader>
    );
  }

  const r = data.request;
  const currentStatus = status || r.status;

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-2xl text-primary">
          Request #{r.id} — {r.serviceTitle}
        </SheetTitle>
        <SheetDescription>{formatDate(r.createdAt)}</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Name
              </p>
              <p>{r.purchaserName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <p>{r.purchaserEmail}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Phone
              </p>
              <p>{r.purchaserPhone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Company
              </p>
              <p>{r.purchaserCompany || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Project address
              </p>
              <p>{r.projectAddress}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Description
              </p>
              <p className="whitespace-pre-wrap">{r.projectDescription}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Estimated budget
              </p>
              <p>{r.estimatedBudget ? `$${r.estimatedBudget.toLocaleString()}` : "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Start date
              </p>
              <p>{r.startDate || "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="newstatus">Status</Label>
              <Select
                value={currentStatus}
                onValueChange={(v) => setStatus(v)}
              >
                <SelectTrigger id="newstatus" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Admin notes</Label>
              <Textarea
                id="notes"
                value={notes || r.adminNotes || ""}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>
            <Button
              disabled={update.isPending}
              onClick={async () => {
                await update.mutateAsync({
                  id: r.id,
                  data: {
                    status: (currentStatus as Status),
                    adminNotes: notes || r.adminNotes || null,
                  },
                });
                onUpdated();
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {update.isPending ? "Saving…" : "Save changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Messages ({data.messages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.messages.length === 0 ? (
              <p className="text-muted-foreground text-sm">No messages.</p>
            ) : (
              <ul className="space-y-3">
                {data.messages.map((m) => (
                  <li key={m.id} className="border rounded p-3 bg-muted/30">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <Badge
                        variant={
                          m.direction === "outbound" ? "default" : "secondary"
                        }
                      >
                        {m.direction}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatDate(m.createdAt)}
                      </span>
                    </div>
                    <p className="font-semibold text-sm">{m.subject}</p>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap mt-1">
                      {m.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Payment requests ({data.payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.payments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No payments.</p>
            ) : (
              <ul className="space-y-3">
                {data.payments.map((p) => (
                  <li
                    key={p.id}
                    className="border rounded p-3 bg-muted/30 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold">
                        {formatUSD(p.amountCents)}{" "}
                        <span className="text-muted-foreground font-normal text-sm">
                          {p.currency.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm">{p.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(p.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={PAYMENT_STATUS_COLOR[p.status] ?? ""}
                    >
                      {p.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
