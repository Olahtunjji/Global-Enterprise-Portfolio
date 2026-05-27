import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Anchor,
  BookOpen,
  Building2,
  ExternalLink,
  Globe,
  Shield,
  Wrench,
  Award,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const REFERENCES = [
  {
    category: "Regulatory — United Nations Agency",
    icon: Globe,
    sources: [
      {
        name: "International Maritime Organization (IMO)",
        role: "Publisher of STCW, SOLAS, MARPOL, ISM Code, and all global maritime conventions. Primary authority for 2nd Engineer certification and regulatory obligations.",
        url: "https://imo.org",
        domain: "imo.org",
      },
    ],
  },
  {
    category: "Industry — Shipping Associations",
    icon: Building2,
    sources: [
      {
        name: "International Chamber of Shipping (ICS)",
        role: "Provides industry best-practice guides including the Tanker Safety Guide, Ship's Bridge Procedures Guide, and ISM compliance guidance used by shipowners worldwide.",
        url: "https://ics-shipping.org",
        domain: "ics-shipping.org",
      },
    ],
  },
  {
    category: "Regulatory — Seabed Governance",
    icon: Anchor,
    sources: [
      {
        name: "International Seabed Authority (ISA)",
        role: "Governs all mineral resource activities in the international seabed. Engineers on survey, cable, or mining vessels must comply with ISA environmental protection regulations under UNCLOS Part XI.",
        url: "https://isa.org.jm",
        domain: "isa.org.jm",
      },
    ],
  },
  {
    category: "Ocean Data & Vessel Tracking",
    icon: BarChart3,
    sources: [
      {
        name: "MarineTraffic",
        role: "Real-time AIS-based vessel tracking used by shore-side technical managers and 2nd Engineers for fleet position awareness, port ETAs, and voyage performance monitoring.",
        url: "https://marinetraffic.com",
        domain: "marinetraffic.com",
      },
      {
        name: "Copernicus Marine Service",
        role: "European ocean monitoring programme providing sea surface temperature, current, and sea state data for route planning, ballast water management, and environmental reporting.",
        url: "https://marine.copernicus.eu",
        domain: "marine.copernicus.eu",
      },
    ],
  },
  {
    category: "Technical Knowledge",
    icon: BookOpen,
    sources: [
      {
        name: "Marine Insight",
        role: "Leading maritime knowledge platform covering engine room procedures, equipment guides, regulatory updates, and career pathways widely read by engineers at all levels.",
        url: "https://marineinsight.com",
        domain: "marineinsight.com",
      },
      {
        name: "The Maritime Executive",
        role: "High-level industry news covering regulatory changes, shipping markets, accident investigations, and technology. Essential for tracking IMO regulatory updates and decarbonisation requirements.",
        url: "https://maritime-executive.com",
        domain: "maritime-executive.com",
      },
    ],
  },
  {
    category: "Professional Bodies",
    icon: Award,
    sources: [
      {
        name: "The Nautical Institute",
        role: "Offers Dynamic Positioning (DP) certification, professional membership (MNI / FNI), and continuing professional development programmes for offshore and DP-equipped vessels.",
        url: "https://nautinst.org",
        domain: "nautinst.org",
      },
      {
        name: "Int'l Institute of Marine Surveying (IIMS)",
        role: "Provides qualifications and membership for marine surveyors. Experienced 2nd Engineers may qualify for IIMS membership and transition into independent machinery surveys and casualty investigations.",
        url: "https://iims.org.uk",
        domain: "iims.org.uk",
      },
    ],
  },
  {
    category: "Academic — Postgraduate",
    icon: Building2,
    sources: [
      {
        name: "World Maritime University (WMU)",
        role: "IMO-linked postgraduate institution in Malmö, Sweden. Offers MSc and PhD programmes in maritime affairs, port management, and ocean sustainability for engineers moving into management or policy roles.",
        url: "https://wmu.se",
        domain: "wmu.se",
      },
    ],
  },
];

const MANAGEMENT_METRICS = [
  {
    icon: CheckCircle2,
    label: "Compliance Standard",
    value: "STCW 2010 Manila Amendments",
  },
  {
    icon: Shield,
    label: "Safety Conventions",
    value: "MARPOL / SOLAS / ISM Compliant",
  },
  {
    icon: Users,
    label: "Regulatory Authority",
    value: "IMO, NIMASA, MPA",
  },
  {
    icon: TrendingUp,
    label: "Fleet Intelligence",
    value: "AIS-Based Tracking",
  },
  {
    icon: Award,
    label: "Professional Grade",
    value: "2nd Engineer Certified",
  },
  {
    icon: Wrench,
    label: "Equipment Standards",
    value: "Caterpillar / Damen / Bitzer",
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
        runs through Apapa and Tin Can, and FPSO mobilisations — with the
        precision expected by Caterpillar, Damen, NIMASA, the IMO, and the
        Maritime Coast Guard.
      </p>

      <div className="mt-12">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Management Standards Survey
          </h2>
        </div>
        <p className="text-foreground/70 mb-8 max-w-3xl text-sm">
          Compiled per IMO STCW 2010 Manila Amendments — MARPOL / SOLAS / ISM Compliant
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {MANAGEMENT_METRICS.map((m) => (
            <div
              key={m.label}
              className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2"
            >
              <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <m.icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {m.label}
              </p>
              <p className="text-sm font-semibold text-foreground leading-snug">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {REFERENCES.map((ref) => (
            <Card key={ref.category} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ref.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    {ref.category}
                  </p>
                  <CardTitle className="text-base leading-snug">
                    {ref.sources.map((s) => s.name).join(" · ")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {ref.sources.map((source) => (
                  <div key={source.name}>
                    {ref.sources.length > 1 && (
                      <p className="text-sm font-semibold text-primary mb-1">
                        {source.name}
                      </p>
                    )}
                    <p className="text-sm text-foreground/80 leading-relaxed mb-2">
                      {source.role}
                    </p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                    >
                      <Globe className="w-3 h-3" />
                      {source.domain}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
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
          and full traceability of every project milestone — meeting the same
          standards demanded by IMO, NIMASA, and ICS for maritime operations.
        </p>
      </div>
    </div>
  );
}
