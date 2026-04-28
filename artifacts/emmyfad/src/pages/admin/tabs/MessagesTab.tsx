import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListMessages,
  useCreateMessage,
  useListServiceRequests,
  getListMessagesQueryKey,
  getGetServiceRequestQueryKey,
  getListAuditLogQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "../utils";

export default function MessagesTab() {
  const { data: messages = [], isLoading } = useListMessages({});
  const { data: requests = [] } = useListServiceRequests({});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const create = useCreateMessage();

  const [serviceRequestId, setServiceRequestId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  async function send() {
    const id = parseInt(serviceRequestId, 10);
    if (!id || !subject || !body) {
      toast({
        title: "Missing fields",
        description: "Pick a request and fill subject and body.",
        variant: "destructive",
      });
      return;
    }
    try {
      await create.mutateAsync({
        data: { serviceRequestId: id, subject, body },
      });
      queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({}) });
      queryClient.invalidateQueries({
        queryKey: getGetServiceRequestQueryKey(id),
      });
      queryClient.invalidateQueries({ queryKey: getListAuditLogQueryKey() });
      queryClient.invalidateQueries({
        queryKey: getGetDashboardSummaryQueryKey(),
      });
      toast({ title: "Message sent", description: `Sent to request #${id}` });
      setSubject("");
      setBody("");
    } catch (err) {
      toast({
        title: "Failed to send",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Compose message</CardTitle>
            <CardDescription>
              Outbound only — replies arrive by email and can be filed manually.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reqId">Service request</Label>
              <Select value={serviceRequestId} onValueChange={setServiceRequestId}>
                <SelectTrigger id="reqId" className="mt-2">
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
              <Label htmlFor="subj">Subject</Label>
              <Input
                id="subj"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className="mt-2"
              />
            </div>
            <Button
              onClick={send}
              disabled={create.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              {create.isPending ? "Sending…" : "Send message"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Message queue</CardTitle>
            <CardDescription>Most recent first.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : messages.length === 0 ? (
              <p className="text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className="p-4 border rounded-md bg-muted/30"
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            m.direction === "outbound" ? "default" : "secondary"
                          }
                        >
                          {m.direction}
                        </Badge>
                        <span className="text-muted-foreground">
                          Req #{m.serviceRequestId}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          {m.recipientEmail}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatDate(m.createdAt)}
                      </span>
                    </div>
                    <p className="font-semibold">{m.subject}</p>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap mt-1">
                      {m.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
