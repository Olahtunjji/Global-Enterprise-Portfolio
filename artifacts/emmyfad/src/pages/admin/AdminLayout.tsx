import { Show, useClerk } from "@clerk/react";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Anchor, ExternalLink } from "lucide-react";
import OverviewTab from "./tabs/OverviewTab";
import RequestsTab from "./tabs/RequestsTab";
import ContactsTab from "./tabs/ContactsTab";
import MessagesTab from "./tabs/MessagesTab";
import PaymentsTab from "./tabs/PaymentsTab";
import AuditTab from "./tabs/AuditTab";

export default function AdminLayout() {
  const { signOut } = useClerk();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
      <Show when="signed-in">
        <div className="min-h-[100dvh] flex flex-col bg-background">
          <header className="h-16 border-b border-border bg-primary text-primary-foreground flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Anchor className="w-5 h-5 text-accent" />
              <span className="text-lg font-bold tracking-tight">
                EMMYFAD Admin
              </span>
              <Link
                href="/"
                className="ml-4 text-sm text-primary-foreground/70 hover:text-primary-foreground inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View site
              </Link>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => signOut({ redirectUrl: `${basePath}/` })}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </header>

          <div className="container mx-auto px-4 md:px-6 py-6 flex-1 w-full">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requests">Service Requests</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="audit">Bookkeeping</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <OverviewTab />
              </TabsContent>
              <TabsContent value="requests" className="mt-6">
                <RequestsTab />
              </TabsContent>
              <TabsContent value="contacts" className="mt-6">
                <ContactsTab />
              </TabsContent>
              <TabsContent value="messages" className="mt-6">
                <MessagesTab />
              </TabsContent>
              <TabsContent value="payments" className="mt-6">
                <PaymentsTab />
              </TabsContent>
              <TabsContent value="audit" className="mt-6">
                <AuditTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Show>
    </>
  );
}
