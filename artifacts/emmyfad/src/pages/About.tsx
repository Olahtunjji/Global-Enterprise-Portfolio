import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Database,
  KeyRound,
  Layers,
  Map as MapIcon,
  Server,
  ShieldCheck,
  Wrench,
  CreditCard,
  Sparkles,
} from "lucide-react";

const STACK = [
  {
    label: "Frontend",
    icon: Code2,
    items: [
      "React 19 + Vite",
      "TypeScript",
      "Tailwind CSS v4 + shadcn/ui",
      "TanStack Query for data fetching",
      "Wouter for routing",
      "Framer Motion for tasteful animation",
    ],
  },
  {
    label: "Backend",
    icon: Server,
    items: [
      "Node.js with Express 5",
      "Pino structured logging",
      "Zod request and response validation",
    ],
  },
  {
    label: "Database",
    icon: Database,
    items: [
      "PostgreSQL",
      "Drizzle ORM",
      "Schema-first migrations",
    ],
  },
  {
    label: "API contract",
    icon: Layers,
    items: [
      "OpenAPI 3.1 specification",
      "Orval client and Zod codegen",
      "End-to-end typed API",
    ],
  },
  {
    label: "Authentication",
    icon: KeyRound,
    items: [
      "Clerk email + password authentication",
      "Session cookies with secure proxy",
    ],
  },
  {
    label: "Payments",
    icon: CreditCard,
    items: [
      "Stripe Checkout for milestone payments",
      "Admin-issued payment requests with audit trail",
    ],
  },
  {
    label: "Maps",
    icon: MapIcon,
    items: [
      "Leaflet + react-leaflet",
      "OpenStreetMap raster tiles",
    ],
  },
  {
    label: "Operational discipline",
    icon: ShieldCheck,
    items: [
      "Audit log on all admin actions",
      "Role-gated admin dashboard",
      "Bookkeeping-ready record keeping",
    ],
  },
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Badge variant="secondary" className="mb-2 uppercase tracking-wider">
        About this firm
      </Badge>
      <h1 className="text-4xl font-bold tracking-tight text-primary">
        EMMYFAD Global Enterprise
      </h1>
      <p className="mt-4 text-lg text-foreground/85 leading-relaxed">
        EMMYFAD Global Enterprise is a Lagos-based marine engineering and
        maritime procurement firm. The company purchases, repairs, and services
        diesel marine engines and maritime equipment, and supervises offshore
        and port-side projects for shipowners, port authorities, and government
        regulators across West Africa.
      </p>
      <p className="mt-4 text-lg text-foreground/85 leading-relaxed">
        Founded and led by Fadirepo Emmanuel Opeyemi, the workshop on Idimu
        Road in Ejigbo handles top-end overhauls, full audits, procurement
        runs through Apapa and Tin Can, and FPSO mobilisations &mdash; with the
        precision expected by Caterpillar, Damen, NIMASA, the IMO, and the
        Maritime Coast Guard.
      </p>

      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <Wrench className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            How this site is built
          </h2>
        </div>
        <p className="text-foreground/85 mb-8 max-w-3xl">
          The EMMYFAD platform is engineered with the same discipline applied
          to a marine engine overhaul &mdash; modern, well-typed, observable,
          and auditable end to end.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {STACK.map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <s.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm text-foreground/85">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 rounded-md bg-primary text-primary-foreground">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">Built for transparency</h3>
        </div>
        <p className="text-primary-foreground/90 leading-relaxed">
          Every contract request, message, and payment issued through this
          platform is logged in the EMMYFAD audit trail for clean bookkeeping
          and full traceability of every project milestone.
        </p>
      </div>
    </div>
  );
}
