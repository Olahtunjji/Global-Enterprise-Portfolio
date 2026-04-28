import { useListAuditLog } from "@workspace/api-client-react";
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
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils";

export default function AuditTab() {
  const { data = [], isLoading } = useListAuditLog();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-primary">Bookkeeping &amp; audit log</h2>
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>
            Every state change in the platform is recorded here for clean
            bookkeeping and traceability.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>Loading…</TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(e.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{e.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {e.entityType}
                      {e.entityId != null && ` · #${e.entityId}`}
                    </TableCell>
                    <TableCell className="text-xs">{e.actor}</TableCell>
                    <TableCell className="text-sm">{e.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No activity yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
