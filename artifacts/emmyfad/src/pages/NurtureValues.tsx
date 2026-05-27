import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, ExternalLink, Camera, BookOpen, Layers } from "lucide-react";

import img3a from "@assets/emmyfad3_1779894395233.jpeg";
import img3b from "@assets/emmyfad3_1779894411423.jpeg";
import img4 from "@assets/emmyfad4_1779894423526.jpeg";
import img5 from "@assets/emmyfad5_1779894433710.jpeg";
import img6 from "@assets/emmyfad6_1779894443116.jpeg";
import img11 from "@assets/emmyfad11_1779894508521.jpeg";
import img13 from "@assets/emmyfad13_1779894542920.jpeg";
import img15 from "@assets/emmyfad15_1779894571451.jpeg";
import img16 from "@assets/emmyfad16_1779894588439.jpeg";
import img43 from "@assets/emmyfad43_1779894833441.jpeg";
import img44 from "@assets/emmyfad44_1779894820242.jpeg";
import img45 from "@assets/emmyfad45_1779894805659.jpeg";
import img49 from "@assets/emmyfad49_1779894788197.jpeg";
import img50 from "@assets/emmyfad50_1779894776773.jpeg";
import img51 from "@assets/emmyfad51_1779894764233.jpeg";
import img52 from "@assets/emmyfad52_1779894743740.jpeg";
import img53 from "@assets/emmyfad53_1779894727304.jpeg";
import img54 from "@assets/emmyfad54_1779894714534.jpeg";
import img55 from "@assets/emmyfad55_1779894704176.jpeg";

const MUSEUM_ITEMS = [
  {
    id: 1,
    src: img43,
    title: "CAT STBD Main Engine Junction Box",
    category: "Engine Management",
    description:
      "Caterpillar digital engine monitoring panel installed on a starboard main engine. The touchscreen displays real-time data critical to safe vessel operation.",
    facts: [
      "Engine Speed: 1,984 RPM displayed on circular gauge",
      "Coolant Temperature: 95°C — within normal range",
      "Engine Oil Pressure: 444 kPa — healthy operating pressure",
      "Engine Load: 80% — high-efficiency working load",
      "Engine Hours: 17,941.6 hrs — documented service history",
      "Fuel Rate: 228 L/hr — consumption logged for billing and audit",
      "Battery Voltage: 26.1 V — confirms healthy electrical system",
      "Compliant with CAT Electronic Monitoring System (EMS) standards",
    ],
  },
  {
    id: 2,
    src: img55,
    title: "GJESI Compressor Control System",
    category: "Refrigeration Systems",
    description:
      "Marine HVAC compressor control panel showing live status of a shipboard cooling system. This unit is responsible for maintaining cargo and accommodation temperatures.",
    facts: [
      "Compressor running hours: 7,787 hrs — logged service life",
      "Fresh Air Temp: 25.0°C — ambient condition recorded",
      "Return Air Temp: 28.1°C — heat load measurement",
      "Supply Air Temp: 29.5°C — pre-cooling measurement",
      "Air Temp Setpoint: 21.0°C — target cooling temperature",
      "Status indicators: Standby, Crankcase Heat, Release Compr active",
      "Delay Crankcase alarm visible — triggers pre-start heating protocol",
      "MARPOL-compliant refrigerant management (HP/LP alarm monitoring)",
    ],
  },
  {
    id: 3,
    src: img54,
    title: "BITZER Marine Refrigeration Unit",
    category: "Refrigeration Systems",
    description:
      "Industrial-grade BITZER screw compressor unit fitted in a ship's engine room. BITZER compressors are the global benchmark for marine refrigeration reliability.",
    facts: [
      "BITZER semi-hermetic screw compressor — rated for continuous marine duty",
      "R-407C refrigerant (non-ozone-depleting HFC blend)",
      "VACON variable frequency drive (VFD) for energy-efficient speed control",
      "Braided stainless-steel flexible hoses — vibration resistant",
      "CE-marked components — compliant with EU Machinery Directive",
      "Blue and orange manifold gauges for low-side and high-side pressure readings",
      "Used across cruise ships, cargo vessels, and naval platforms",
      "Controlled via PLC — supports remote monitoring and fault diagnostics",
    ],
  },
  {
    id: 4,
    src: img52,
    title: "BITZER Compressor with VACON VFD",
    category: "Refrigeration Systems",
    description:
      "Close-up of the VACON variable frequency drive mounted alongside the BITZER compressor. VFDs reduce power consumption by matching compressor speed to actual cooling demand.",
    facts: [
      "VACON AC drive — industrial VFD for precise motor speed regulation",
      "Reduces energy consumption by 30–50% versus fixed-speed operation",
      "Charge In Liquid Phase Only warning label — refrigerant handling protocol",
      "R-407C refrigerant charge point visible",
      "Integrated digital display shows drive status and fault codes",
      "Fully programmable ramp-up/ramp-down for soft motor starting",
      "Protects compressor against over-current and short-circuit faults",
      "Compliant with IEC 61800 variable-speed electrical drive standards",
    ],
  },
  {
    id: 5,
    src: img53,
    title: "Refrigeration System Pressure Panel",
    category: "Refrigeration Systems",
    description:
      "BITZER refrigeration rack showing the pressure gauge panel, suction and discharge manifolds, and fire safety signage. Pressure readings are essential for diagnosing refrigerant charge and system performance.",
    facts: [
      "Four Bourdon-tube analog pressure gauges mounted in series",
      "Gauges measure suction pressure, discharge pressure, and oil pressure",
      "Red fire extinguisher safety sign — IMO A.951 compliant marking",
      "Low-voltage control modules visible at bottom — solenoid valve drivers",
      "Interconnecting black high-pressure hoses with rated fittings",
      "Gauge panel allows real-time load balancing across compressor stages",
      "Used in conjunction with GJESI controller for automated fault response",
      "SOLAS Chapter II-2 fire safety compliance evident from signage",
    ],
  },
  {
    id: 6,
    src: img13,
    title: "CAT Marine Power Diagnostic Session",
    category: "Engine Diagnostics",
    description:
      "Live diagnostic session on a Caterpillar marine generator set using an HP laptop connected to the ELC (Electronic Load Control) system. CAT Electronic Technician (ET) software is used for fault code reading and calibration.",
    facts: [
      "Caterpillar marine generator visible — yellow housing with CAT MARINE POWER badge",
      "ELC (Electronic Load Control) panel with touchscreen readout mounted above",
      "Emergency STOP button (red mushroom) clearly accessible — SOLAS requirement",
      "HP laptop running CAT ET (Electronic Technician) diagnostic software",
      "Direct USB/serial interface to engine ECM for real-time parameter logging",
      "CAT ET can read active/logged fault codes and program injector trim files",
      "Confirms engine calibration against OEM factory specifications",
      "Used for warranty repair documentation and pre-handover surveys",
    ],
  },
  {
    id: 7,
    src: img3a,
    title: "PRUFTECHNIK ROTALIGN Ultra iS — Shaft Alignment",
    category: "Precision Alignment",
    description:
      "The PRUFTECHNIK ROTALIGN Ultra iS is the world-leading laser shaft alignment instrument. This handheld computer guides the technician through soft-foot correction, live moves, and measurement reporting.",
    facts: [
      "ROTALIGN Ultra iS uses dual-axis laser sensors for micron-level accuracy",
      "Display shows motor-to-machine alignment values with tolerance limits",
      "1,500 RPM motor speed programmed for this alignment job",
      "Target machine alignment gap values visible on screen (57.5 / 80 mm)",
      "Corrective offset displayed: 2.28 mm vertical misalignment detected",
      "Compliant with ISO 10816 vibration and alignment standards",
      "Used on turbines, pumps, generators, and marine propulsion shafts",
      "Data stored and exported as PDF alignment certificate for client records",
    ],
  },
  {
    id: 8,
    src: img3b,
    title: "ROTALIGN Ultra iS — Alignment Verification",
    category: "Precision Alignment",
    description:
      "Second-stage verification reading confirming final alignment state after shimming and bolt adjustment. The device confirms the coupled machine is within tolerance before re-commissioning.",
    facts: [
      "Post-correction reading taken to verify shim adjustments are correct",
      "Tolerance pass/fail indicators confirm alignment within ISO limits",
      "Measurement precision: 0.001 mm (1 micron) in static mode",
      "Soft-foot measurement capability prevents false alignment readings",
      "Stores before/after records for maintenance documentation",
      "Used for motor-pump, engine-gearbox, and shaft-propeller alignment",
      "Each job produces an exportable certificate with signature field",
      "EMMYFAD uses this for all rotating machinery sign-off prior to sea trial",
    ],
  },
  {
    id: 9,
    src: img4,
    title: "Flywheel Coupling Alignment Check",
    category: "Precision Alignment",
    description:
      "Dial gauge assembly mounted on a large flywheel ring for runout and face alignment measurement. The yellow casting is a Caterpillar or Damen marine engine bell housing.",
    facts: [
      "Dual dial gauge setup measures both radial and face (axial) misalignment",
      "Flywheel diameter indicates a large bore diesel engine (likely CAT 3500 or C32 series)",
      "Star-pattern bolt configuration visible on flywheel face — typical SAE coupling",
      "Measurement bar spans flywheel radius for accurate TIR (Total Indicated Runout)",
      "TIR tolerance for marine flywheels: typically < 0.05 mm (0.002 inch)",
      "Procedure follows OEM flywheel housing bore concentricity check",
      "Required before coupling any new transmission, gearbox, or reduction drive",
      "Documented per Caterpillar Service Manual and SOLAS inspection protocols",
    ],
  },
  {
    id: 10,
    src: img5,
    title: "Dial Gauge Face Runout Measurement",
    category: "Precision Alignment",
    description:
      "Technician measuring face runout on a flywheel housing flange using a dial indicator on a magnetic base. This procedure confirms the flywheel housing is square to the crankshaft centreline.",
    facts: [
      "Dial indicator reads in 0.01 mm increments for face runout checking",
      "Red probe tip contacts flywheel face — rotated through 360° for full sweep",
      "Magnetic base with articulating arm allows precise probe positioning",
      "Acceptable face runout limit: < 0.13 mm for most marine diesel engines",
      "Misalignment here causes premature coupling, seal, and bearing failure",
      "Measurement logged at North, South, East, West positions (4-point method)",
      "Consistent with Caterpillar 3500 Family engine rebuild procedure",
      "Used before bolting on a new transmission, shaft coupling, or gearbox",
    ],
  },
  {
    id: 11,
    src: img6,
    title: "Marine Motor Terminal Box Wiring",
    category: "Electrical Systems",
    description:
      "Open motor terminal box showing colour-coded three-phase wiring connections and a Saia-Burgess actuator module. This type of wiring is standard on deck machinery motors and pump drives.",
    facts: [
      "Three-phase wiring: Blue (L2), Brown (L1), Green/Yellow (Earth) visible",
      "CE-marked control module — compliant with EU Low Voltage Directive",
      "Serial label shows commissioning date: 24-10-2015, 14:20, S/N: 0243",
      "M01 designation — first motor in the control zone (zone labelling convention)",
      "Crimp-terminal connections on both power and control circuits",
      "Red and black control wires route to PLC or motor protection relay",
      "Earthing conductor correctly fitted to motor frame — IEC 60034 compliant",
      "This configuration is typical of HVAC fan motors and bilge pump drives",
    ],
  },
  {
    id: 12,
    src: img11,
    title: "Stern Tube Shaft Seal Inspection",
    category: "Propulsion Systems",
    description:
      "Close-up of a marine stern tube or bulkhead shaft seal assembly showing the mounting flange, seal face, and cable gland penetration. Stern tube seals prevent seawater ingress around the propeller shaft.",
    facts: [
      "Seal mounting flange with 6 stainless cap screws visible — AISI 316 grade",
      "Central circular seal face — lip-type or mechanical face seal design",
      "Black rubber hose routed through cable gland — lubricating oil or monitoring line",
      "Duct tape temporary repair on outer shell — common temporary fix in service",
      "Rust-staining indicates saltwater environment — typical for stern tube area",
      "Stern tube seals require regular greasing per OEM interval schedule",
      "Leaking stern tube seals are a MARPOL pollution risk — surveyed by NIMASA",
      "Replacement typically performed during drydock or when vessel is on the slip",
    ],
  },
  {
    id: 13,
    src: img15,
    title: "CAT 8-Pin Sensor Connector (Female)",
    category: "Engine Diagnostics",
    description:
      "Close-up of an 8-pin round female connector used on Caterpillar marine engines for sensor and data link harness connections. This connector type is common on CAT C-series and 3500-series engines.",
    facts: [
      "8-pin DT-series (Deutsch) connector — rated IP67 waterproof",
      "Pins carry signals for sensors: coolant temp, oil pressure, speed/timing",
      "Blue illuminated ring on connector indicates active diagnostic port",
      "Used for CAT Data Link (CDL) and CAN-J1939 communication protocols",
      "Rated for 14–16 AWG wiring in marine environments",
      "Gold-plated contacts resist corrosion in high-humidity engine rooms",
      "Mating male connector connects to ECM wiring harness",
      "Incorrect pin-out causes faults logged in the ECM fault history",
    ],
  },
  {
    id: 14,
    src: img16,
    title: "CAT 5-Pin Data Link Connector (Male)",
    category: "Engine Diagnostics",
    description:
      "5-pin round male diagnostic connector from a Caterpillar marine engine harness. This is typically the CAT ET service port or a J1939 CAN bus connection point used for laptop diagnostic access.",
    facts: [
      "5-pin Deutsch connector — standard CAT ET service tool interface",
      "Carries CAT Data Link (CDL) for communication with CAT ET software",
      "Pin configuration: Power (1), Ground (2), CDL+ (3), CDL- (4), Shield (5)",
      "Allows reading of active/inactive fault codes and engine parameters",
      "Used with MPSI Pro-Link or CAT Communications Adapter (CAT-ET cable)",
      "Critical for injector trim calibration after fuel pump or injector replacement",
      "Connector must be capped when not in use — prevents moisture ingress",
      "Compatible with SAE J1939 standard — universal across CAT marine range",
    ],
  },
  {
    id: 15,
    src: img44,
    title: "Sea Recovery AquaMatic Watermaker",
    category: "Auxiliary Systems",
    description:
      "Sea Recovery AquaMatic reverse osmosis (RO) freshwater generator installed on a vessel. This system converts seawater to potable drinking water for crew and operations at sea.",
    facts: [
      "Sea Recovery AquaMatic — a leading brand in marine RO watermakers",
      "Reverse osmosis membranes filter salt and impurities to drinking water standard",
      "Blue pre-filter housing removes particulates before RO membrane",
      "Output range: typically 500–3,000 litres/day depending on model",
      "Touchscreen control panel for monitoring feed pressure, permeate flow, and TDS",
      "WHO Drinking Water Quality Standards compliance for crew potable water",
      "MARPOL-relevant — ensures vessel self-sufficiency without shore water connections",
      "Requires regular membrane flushing and anti-scalant chemical dosing",
    ],
  },
  {
    id: 16,
    src: img45,
    title: "Governor / Fuel Injection Pump Overhaul",
    category: "Engine Overhaul",
    description:
      "Complete teardown of a diesel engine governor and fuel injection pump on a workshop bench. Every component has been cleaned, measured, and laid out for inspection before reassembly.",
    facts: [
      "Governor housing, plunger barrel, delivery valves, and springs all disassembled",
      "Control rack, cam disc, and governor flyweights visible — the heart of speed control",
      "Hydraulic head with four-cylinder port plate laid out top-right (part tag: 2067)",
      "All O-rings, seals, and gaskets replaced as a matter of course during overhaul",
      "Components measured against OEM wear limits using micrometers and gauges",
      "Reassembled on a calibration bench and set to OEM fuel delivery specifications",
      "Governor calibration ensures stable idle, rated RPM, and load response",
      "Consistent with Bosch, CAV, and Zexel injection pump overhaul procedures",
    ],
  },
  {
    id: 17,
    src: img50,
    title: "CAT Genuine Fuel Pump Assembly (570-6292)",
    category: "Parts & Procurement",
    description:
      "Caterpillar genuine fuel pump assembly (part number 570-6292) sourced and photographed on receipt. EMMYFAD procures only OEM parts through Apapa and Tin Can port channels to ensure full warranty compliance.",
    facts: [
      "CAT Part No. 570-6292 — genuine Caterpillar fuel transfer pump assembly",
      "Sourced from Caterpillar UK dealer network (GB designation on label)",
      "Includes integrated solenoid valve and fuel return connector",
      "Braided electrical harness pre-fitted — plug-and-play installation",
      "Packaged in CAT-standard brown kraft paper with CE marking",
      "Used on CAT C7, C9, C12, and 3126 marine engine fuel systems",
      "Genuine parts ensure STCW-mandated equipment reliability on commercial vessels",
      "All part receipts are retained for audit log and NIMASA inspection records",
    ],
  },
  {
    id: 18,
    src: img49,
    title: "Stud Bolt Extraction — CAT Engine",
    category: "Engine Overhaul",
    description:
      "Technician extracting a seized stud bolt from a Caterpillar engine block using a stud remover tool. Seized studs are common in marine environments due to salt-water corrosion and high thermal cycling.",
    facts: [
      "Stud remover grips the stud between two machined flats using a cam action",
      "Silver zinc-plated stud with brass thread insert — corrosion-resistant design",
      "Black rubber fuel hose and high-pressure injector lines visible in background",
      "Yellow CAT engine block shows characteristic cast-iron construction",
      "Penetrating oil applied before extraction to break corrosion bond",
      "Damaged studs replaced with OEM-spec high-tensile steel equivalents",
      "Stud torque values re-specified per CAT Service Bulletin requirements",
      "Documented in engine rebuild record for warranty and survey purposes",
    ],
  },
  {
    id: 19,
    src: img51,
    title: "Stockless Anchor — Procured & Ready",
    category: "Marine Hardware & Procurement",
    description:
      "A heavy-duty stockless anchor photographed on a paved yard, with marine hoses and equipment in the background. Stockless anchors are the standard type for commercial vessels globally.",
    facts: [
      "Stockless (Hall-type) anchor — standard fitting on IMO-classed commercial vessels",
      "Pivoting flukes (palms) self-orient to maximise seabed grip",
      "Rated holding power is approximately 2–3x anchor deadweight",
      "Manufactured from cast steel — Grade A mild steel or higher",
      "Shackle pin at crown for connection to anchor chain or wire",
      "Weight estimated at 100–200 kg based on visual scale",
      "Procured through Apapa port suppliers — EMMYFAD's marine hardware channel",
      "All anchoring equipment surveyed to SOLAS Chapter II-1 requirements",
    ],
  },
];

const GRID_PHOTOS = MUSEUM_ITEMS.map((item) => ({
  id: item.id,
  src: item.src,
  title: item.title,
  category: item.category,
}));

const CATEGORY_COLORS: Record<string, string> = {
  "Engine Management": "bg-blue-100 text-blue-800",
  "Refrigeration Systems": "bg-green-100 text-green-800",
  "Engine Diagnostics": "bg-yellow-100 text-yellow-800",
  "Precision Alignment": "bg-purple-100 text-purple-800",
  "Electrical Systems": "bg-orange-100 text-orange-800",
  "Propulsion Systems": "bg-red-100 text-red-800",
  "Auxiliary Systems": "bg-teal-100 text-teal-800",
  "Engine Overhaul": "bg-amber-100 text-amber-800",
  "Parts & Procurement": "bg-cyan-100 text-cyan-800",
  "Marine Hardware & Procurement": "bg-slate-100 text-slate-800",
};

export default function NurtureValues() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(MUSEUM_ITEMS.map((i) => i.category))),
  ];

  const filtered =
    activeCategory === "All"
      ? MUSEUM_ITEMS
      : MUSEUM_ITEMS.filter((i) => i.category === activeCategory);

  const lightboxItem = lightbox !== null ? MUSEUM_ITEMS.find((i) => i.id === lightbox) : null;

  return (
    <div className="min-h-screen bg-background">
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-3xl w-full bg-background rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.src}
              alt={lightboxItem.title}
              className="w-full max-h-[60vh] object-contain bg-black"
            />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    CATEGORY_COLORS[lightboxItem.category] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {lightboxItem.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {lightboxItem.title}
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                {lightboxItem.description}
              </p>
              <div className="space-y-1.5">
                {lightboxItem.facts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground/75">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Badge variant="secondary" className="mb-2 uppercase tracking-wider">
          Portfolio
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-3">
          Nurture &amp; Values
        </h1>
        <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mb-8">
          A documented record of EMMYFAD Global Enterprise's fieldwork — precision
          alignment sessions, engine overhauls, refrigeration systems, diagnostic
          work, and marine procurement. Every image tells the story of a standard met
          and a vessel returned to service.
        </p>

        <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-lg bg-muted/40 border border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
            <Camera className="w-4 h-4" />
            <span>Photo Archive</span>
          </div>
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Google Drive Photo Album
          </a>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-primary">Photo Grid</h2>
            <span className="text-sm text-muted-foreground">
              ({GRID_PHOTOS.length} photographs)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GRID_PHOTOS.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setLightbox(photo.id)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-end p-2">
                  <p className="text-white text-xs font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-primary">Photo Museum</h2>
            <span className="text-sm text-muted-foreground">
              — Calibrations, Equipment &amp; Field Facts
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {filtered.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-5 gap-0">
                  <button
                    onClick={() => setLightbox(item.id)}
                    className="md:col-span-2 aspect-video md:aspect-auto bg-black overflow-hidden group"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                  <CardContent className="md:col-span-3 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Technical Facts
                      </p>
                      {item.facts.map((fact, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm text-foreground/75"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
