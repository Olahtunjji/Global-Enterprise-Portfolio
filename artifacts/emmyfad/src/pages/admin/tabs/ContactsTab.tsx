import { useListContacts } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "../utils";
import { Badge } from "@/components/ui/badge";

export default function ContactsTab() {
  const { data, isLoading } = useListContacts();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-primary">Contacts</h2>
      <p className="text-muted-foreground">
        Customers who have submitted at least one contract request.
      </p>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead>Last contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading…</TableCell>
                </TableRow>
              ) : data && data.length > 0 ? (
                data.map((c) => (
                  <TableRow key={c.email}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.company || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{c.requestCount}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(c.lastContactAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    No contacts yet.
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
