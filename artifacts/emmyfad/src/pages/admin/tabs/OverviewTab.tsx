import { useGetDashboardSummary } from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatUSD, formatDate, STATUS_COLOR } from "../utils";
import { Badge } from "@/components/ui/badge";

const Stat = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription className="uppercase tracking-wider text-xs">
        {label}
      </CardDescription>
      <CardTitle className="text-3xl text-primary">{value}</CardTitle>
    </CardHeader>
    {hint && (
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    )}
  </Card>
);

export default function OverviewTab() {
  const { data, isLoading, isError } = useGetDashboardSummary();

  if (isLoading) {
    return <div className="text-muted-foreground">Loading dashboard…</div>;
  }
  if (isError || !data) {
    return (
      <div className="text-destructive">Failed to load dashboard summary.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total requests" value={data.totalRequests} />
        <Stat label="New" value={data.newRequests} hint="Awaiting review" />
        <Stat label="Active contracts" value={data.activeContracts} />
        <Stat label="Completed" value={data.completedContracts} />
        <Stat label="Contacts" value={data.totalContacts} />
        <Stat label="Outbound msgs" value={data.unreadOutbound} />
        <Stat
          label="Revenue (paid)"
          value={formatUSD(data.revenueCents)}
        />
        <Stat
          label="Pending payments"
          value={formatUSD(data.pendingPaymentCents)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by service</CardTitle>
          <CardDescription>Paid contracts grouped by service.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.revenueByService.map((r) => ({
                  name: r.serviceTitle,
                  amount: r.amountCents / 100,
                  count: r.count,
                }))}
                margin={{ top: 10, right: 16, left: 0, bottom: 50 }}
              >
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickFormatter={(v: number) => `$${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(v: number) => `$${v.toLocaleString()}`}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--accent))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent requests</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentRequests.length === 0 ? (
            <p className="text-muted-foreground">No requests yet.</p>
          ) : (
            <ul className="divide-y">
              {data.recentRequests.map((r) => (
                <li
                  key={r.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {r.purchaserName}{" "}
                      <span className="text-muted-foreground font-normal">
                        — {r.serviceTitle}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(r.createdAt)} · {r.purchaserEmail}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={STATUS_COLOR[r.status] ?? ""}
                  >
                    {r.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
