import { useMemo, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetService,
  useCreateServiceRequest,
  getListServiceRequestsQueryKey,
} from "@workspace/api-client-react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const FALLBACK_TERMS = `Standard Nigerian commercial-law contract clauses apply: offer, acceptance, valid consideration, contractual capacity of all parties, intention to create legal relations, lawful object, written confirmation of scope, payment milestones, dispute resolution by negotiation then arbitration in Lagos under the Arbitration and Mediation Act 2023, governing law of the Federal Republic of Nigeria, and termination for material breach with 14 days written notice.`;

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: service, isLoading, isError } = useGetService(slug ?? "", {
    query: { enabled: !!slug },
  });

  const createReq = useCreateServiceRequest();

  const [form, setForm] = useState({
    purchaserName: "",
    purchaserEmail: "",
    purchaserPhone: "",
    purchaserCompany: "",
    projectAddress: "",
    projectDescription: "",
    estimatedBudget: "",
    startDate: "",
  });
  const [accepted, setAccepted] = useState(false);

  const Icon = useMemo(() => {
    if (!service) return Icons.Anchor;
    return ((Icons as unknown) as Record<string, Icons.LucideIcon>)[
      service.iconKey
    ] || Icons.Anchor;
  }, [service]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-muted-foreground">
        Loading service…
      </div>
    );
  }
  if (isError || !service) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold text-primary">Service not found</h1>
        <p className="text-muted-foreground mt-2">
          We could not find that service. Please return to the services list.
        </p>
      </div>
    );
  }

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accepted) {
      toast({
        title: "Contract terms required",
        description: "Please accept the contract terms to submit.",
        variant: "destructive",
      });
      return;
    }
    if (
      !form.purchaserName ||
      !form.purchaserEmail ||
      !form.purchaserPhone ||
      !form.projectAddress ||
      !form.projectDescription
    ) {
      toast({
        title: "Missing required fields",
        description: "Name, email, phone, address and project description are required.",
        variant: "destructive",
      });
      return;
    }
    try {
      const created = await createReq.mutateAsync({
        data: {
          serviceSlug: service.slug,
          purchaserName: form.purchaserName,
          purchaserEmail: form.purchaserEmail,
          purchaserPhone: form.purchaserPhone,
          purchaserCompany: form.purchaserCompany || null,
          projectAddress: form.projectAddress,
          projectDescription: form.projectDescription,
          estimatedBudget: form.estimatedBudget
            ? parseInt(form.estimatedBudget, 10)
            : null,
          startDate: form.startDate || null,
          contractTermsAccepted: accepted,
        },
      });
      queryClient.invalidateQueries({
        queryKey: getListServiceRequestsQueryKey(),
      });
      toast({
        title: "Request received",
        description: `Reference #${created.id}. We will be in touch shortly.`,
      });
      navigate(`/contact?ref=${created.id}`);
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-start gap-4"
      >
        <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <Badge variant="secondary" className="mb-2 uppercase tracking-wider">
            Service offering
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            {service.title}
          </h1>
          <p className="text-lg text-accent mt-1">{service.tagline}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Scope</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none text-foreground/90 leading-relaxed text-base">
              <p>{service.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Deliverables</CardTitle>
              <CardDescription>What you receive at handover.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3">
                    <Icons.CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{d}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Portfolio highlights</CardTitle>
              <CardDescription>Comparable past work.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {service.portfolioHighlights.map((h) => (
                  <li
                    key={h}
                    className="border-l-2 border-accent pl-4 text-foreground/90"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="bg-card border-2 border-border shadow-md">
            <CardHeader>
              <Badge className="w-fit bg-accent text-accent-foreground">
                Contract Request
              </Badge>
              <CardTitle className="text-2xl mt-2">
                Open a contract for {service.title}
              </CardTitle>
              <CardDescription>
                Fill in the request below. A representative will respond within
                two business days to confirm scope and contract terms.
              </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaserName">Full name *</Label>
                    <Input
                      id="purchaserName"
                      value={form.purchaserName}
                      onChange={(e) => update("purchaserName", e.target.value)}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaserEmail">Email *</Label>
                    <Input
                      id="purchaserEmail"
                      type="email"
                      value={form.purchaserEmail}
                      onChange={(e) => update("purchaserEmail", e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaserPhone">Phone *</Label>
                    <Input
                      id="purchaserPhone"
                      value={form.purchaserPhone}
                      onChange={(e) => update("purchaserPhone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaserCompany">Company (optional)</Label>
                    <Input
                      id="purchaserCompany"
                      value={form.purchaserCompany}
                      onChange={(e) =>
                        update("purchaserCompany", e.target.value)
                      }
                      placeholder="Vessel operator / shipowner"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectAddress">Project address *</Label>
                  <Input
                    id="projectAddress"
                    value={form.projectAddress}
                    onChange={(e) => update("projectAddress", e.target.value)}
                    placeholder="Berth, anchorage, or shore facility"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project description *</Label>
                  <Textarea
                    id="projectDescription"
                    value={form.projectDescription}
                    onChange={(e) =>
                      update("projectDescription", e.target.value)
                    }
                    placeholder="Vessel name, equipment make / model, scope of work, urgency."
                    rows={5}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedBudget">
                      Estimated budget (USD)
                    </Label>
                    <Input
                      id="estimatedBudget"
                      type="number"
                      min="0"
                      value={form.estimatedBudget}
                      onChange={(e) =>
                        update("estimatedBudget", e.target.value)
                      }
                      placeholder="e.g. 18000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Preferred start date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                    />
                  </div>
                </div>

                <Accordion type="single" collapsible className="border rounded-md">
                  <AccordionItem value="terms" className="border-b-0">
                    <AccordionTrigger className="px-4">
                      Read the contract terms
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-foreground/85 leading-relaxed">
                      <div className="space-y-3">
                        <p>{service.contractTerms}</p>
                        {!service.contractTerms.includes(
                          "Standard Nigerian commercial-law",
                        ) && <p>{FALLBACK_TERMS}</p>}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <label className="flex items-start gap-3 p-4 border rounded-md bg-muted/40 cursor-pointer">
                  <Checkbox
                    checked={accepted}
                    onCheckedChange={(v) => setAccepted(v === true)}
                    className="mt-0.5"
                    id="accept"
                  />
                  <span className="text-sm text-foreground/90">
                    I have read and accept the contract terms above. I confirm
                    that I have authority to engage EMMYFAD Global Enterprise on
                    behalf of the named party.
                  </span>
                </label>
              </CardContent>
              <CardFooter className="border-t pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  Submitting opens a contract request — it does not create a
                  binding contract until both parties countersign.
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!accepted || createReq.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {createReq.isPending
                    ? "Submitting…"
                    : "Submit contract request"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
