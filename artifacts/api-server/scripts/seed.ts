import {
  db,
  businessProfileTable,
  skillsTable,
  servicesTable,
  landmarksTable,
  serviceRequestsTable,
  messagesTable,
  paymentRequestsTable,
  auditLogTable,
} from "@workspace/db";

const STANDARD_TERMS = `Standard Nigerian commercial-law contract clauses apply: offer, acceptance, valid consideration, contractual capacity of all parties, intention to create legal relations, lawful object, written confirmation of scope, payment milestones, dispute resolution by negotiation then arbitration in Lagos under the Arbitration and Mediation Act 2023, governing law of the Federal Republic of Nigeria, and termination for material breach with 14 days written notice.`;

async function main() {
  // Idempotent reset of seed tables (do not wipe service_requests in production —
  // here we DO wipe everything because this is local development seed data).
  await db.delete(auditLogTable);
  await db.delete(paymentRequestsTable);
  await db.delete(messagesTable);
  await db.delete(serviceRequestsTable);
  await db.delete(landmarksTable);
  await db.delete(servicesTable);
  await db.delete(skillsTable);
  await db.delete(businessProfileTable);

  await db.insert(businessProfileTable).values({
    businessName: "EMMYFAD Global Enterprise",
    ownerName: "Fadirepo Emmanuel Opeyemi",
    email: "efadirepo@yahoo.com",
    address: "62B Idimu Road, Ejigbo, Lagos State, Nigeria",
    nin: "27492502229",
    sex: "Male",
    dateOfBirth: "1991-09-09",
    bio: "EMMYFAD Global Enterprise purchases, repairs, and services diesel marine engines and maritime equipment, and supervises offshore and port-side projects. Founded and led by Fadirepo Emmanuel Opeyemi, the firm partners with shipowners, port authorities, government regulators, and offshore operators across West Africa.",
    latitude: 6.5483,
    longitude: 3.2967,
  });

  await db.insert(skillsTable).values([
    {
      name: "Marine Linkin",
      category: "Equipment OEM",
      valueProposition: "Authorized procurement of OEM marine parts.",
      logoUrl: "",
      accentColor: "#0F4C75",
      iconKey: "Anchor",
      sortOrder: 1,
    },
    {
      name: "Caterpillar",
      category: "Diesel engines",
      valueProposition: "Caterpillar diesel marine engine service.",
      logoUrl: "",
      accentColor: "#FFC72C",
      iconKey: "Cog",
      sortOrder: 2,
    },
    {
      name: "Damen",
      category: "Vessel manufacturer",
      valueProposition: "Damen vessel and shipyard partnership.",
      logoUrl: "",
      accentColor: "#003B71",
      iconKey: "Ship",
      sortOrder: 3,
    },
    {
      name: "Maritime Traffic",
      category: "Tracking",
      valueProposition: "Vessel tracking and AIS intelligence.",
      logoUrl: "",
      accentColor: "#1E88E5",
      iconKey: "Radio",
      sortOrder: 4,
    },
    {
      name: "NIMASA",
      category: "Regulatory body",
      valueProposition: "Compliance with the Nigerian Maritime Administration and Safety Agency.",
      logoUrl: "",
      accentColor: "#0B6623",
      iconKey: "ShieldCheck",
      sortOrder: 5,
    },
    {
      name: "IMO",
      category: "International regulator",
      valueProposition: "International Maritime Organization standards.",
      logoUrl: "",
      accentColor: "#1A237E",
      iconKey: "Compass",
      sortOrder: 6,
    },
    {
      name: "Maritime Coast Guard",
      category: "Security",
      valueProposition: "Coast Guard liaison for security and convoy escort.",
      logoUrl: "",
      accentColor: "#B71C1C",
      iconKey: "LifeBuoy",
      sortOrder: 7,
    },
    {
      name: "MPA",
      category: "Port authority",
      valueProposition: "Port operations with the Maritime Port Authority.",
      logoUrl: "",
      accentColor: "#37474F",
      iconKey: "LandPlot",
      sortOrder: 8,
    },
    {
      name: "Glasgow College",
      category: "Maritime training",
      valueProposition: "Marine engineering training credentials, City of Glasgow College.",
      logoUrl: "",
      accentColor: "#6A1B9A",
      iconKey: "GraduationCap",
      sortOrder: 9,
    },
  ]);

  await db.insert(servicesTable).values([
    {
      slug: "marine-engineering",
      title: "Marine Engineering",
      tagline: "Engine purchase, repair, overhaul, and supervision.",
      description:
        "We source, install, repair, and overhaul marine diesel engines from Caterpillar, MAN, Cummins, and Volvo Penta. Our marine engineering work covers main propulsion units, auxiliary generators, gearboxes, fuel and cooling systems, and complete onboard machinery space refits — both on workboats moored at the Lagos wharves and on vessels in dry dock.",
      deliverables: [
        "Engine condition survey and acceptance report",
        "Parts procurement with OEM warranty trail",
        "Top-end and major overhaul with measured clearances",
        "Sea-trial supervision and commissioning sign-off",
      ],
      portfolioHighlights: [
        "Top-end overhaul of a 1,200 kW Caterpillar 3512 main engine on a Lagos-based crew transfer vessel.",
        "Re-build of two MAN auxiliary generators for a Damen ASD tug.",
        "Supervision of fuel system re-pipe on a Niger Delta supply vessel.",
      ],
      contractTerms:
        "Engineering contracts run on signed scope and milestone payments: 30% on contract execution, 40% on parts delivery, 30% on commissioning sign-off. Warranty: 6 months on labour, OEM warranty on parts. " +
        STANDARD_TERMS,
      iconKey: "Cog",
      sortOrder: 1,
    },
    {
      slug: "maritime-safety",
      title: "Maritime Safety",
      tagline: "SOLAS-compliant safety audits, inspections, and crew drills.",
      description:
        "Independent safety audits aligned with SOLAS, the IMO ISM Code, and NIMASA inspection regimes. We deliver fire-fighting equipment surveys, life-saving appliance servicing, structural condition assessments, and onboard drill supervision so vessels pass port-state inspections without delays.",
      deliverables: [
        "SOLAS-aligned safety audit report",
        "Life-saving appliance and FFA service certificates",
        "Crew drill supervision and competency log",
        "Pre-port-state inspection readiness pack",
      ],
      portfolioHighlights: [
        "ISM internal audit for a four-vessel cabotage operator ahead of NIMASA renewal.",
        "FFA recertification on a coastal tanker prior to charter handover.",
        "Crew drill audit and remediation for an offshore service company.",
      ],
      contractTerms:
        "Safety audit engagements are billed per vessel per day on-site plus a fixed reporting fee. Findings are protected under non-disclosure between EMMYFAD and the owner. " +
        STANDARD_TERMS,
      iconKey: "ShieldCheck",
      sortOrder: 2,
    },
    {
      slug: "maritime-security",
      title: "Maritime Security",
      tagline: "ISPS-aligned security plans, drills, and Coast Guard liaison.",
      description:
        "ISPS-aligned ship and port-facility security plans, with armed-escort coordination through the Nigerian Navy and Maritime Coast Guard for transits through Gulf of Guinea high-risk waters. Crew briefings, Citadel hardening, and security alarm system commissioning included.",
      deliverables: [
        "Ship Security Assessment and Plan (SSP)",
        "Citadel hardening and SSAS installation",
        "Armed-escort and convoy coordination",
        "Security drill supervision",
      ],
      portfolioHighlights: [
        "SSP renewal for a 12-vessel coastal fleet.",
        "Convoy escort coordination for a chartered platform supply vessel transit.",
      ],
      contractTerms:
        "Security engagements are billed per voyage or per vessel-month with separate cost passthrough for armed naval escorts. Confidentiality of security posture is contractual. " +
        STANDARD_TERMS,
      iconKey: "Lock",
      sortOrder: 3,
    },
    {
      slug: "maritime-procurement",
      title: "Maritime Procurement",
      tagline: "Sourcing, customs clearance, and last-mile to the wharf.",
      description:
        "End-to-end procurement of marine spares, deck stores, lubricants, navigation electronics, and safety consumables. We handle vendor qualification, OEM verification, hard-currency settlement, customs clearance through Apapa and Tin Can, and last-mile delivery to vessels alongside or at anchor.",
      deliverables: [
        "Vendor qualification and OEM trace",
        "Quotation pack with three competitive bids",
        "Customs and freight clearance",
        "Wharf or anchorage delivery with signed receipt",
      ],
      portfolioHighlights: [
        "Quarterly spares contract for an offshore support vessel operator.",
        "Emergency turbocharger sourcing and 72-hour wharf delivery.",
      ],
      contractTerms:
        "Procurement is billed on cost-plus or fixed margin per category, agreed in writing per purchase order. Title transfers on customs clearance; risk on signed wharf receipt. " +
        STANDARD_TERMS,
      iconKey: "ShoppingCart",
      sortOrder: 4,
    },
    {
      slug: "safety-gadgets",
      title: "Safety Gadgets",
      tagline: "Lifejackets, SCBA, EEBD, gas detectors, and PPE supply.",
      description:
        "Type-approved safety gadgets and personal protective equipment for marine and offshore use: SOLAS lifejackets and immersion suits, SCBA and EEBD sets, fixed and portable gas detectors, fire blankets, hand-held VHFs, and full PPE bundles. We service, recertify, and stock-control on the vessel's behalf.",
      deliverables: [
        "Type-approved equipment supply with certificates",
        "Annual servicing and recertification",
        "Stock control and replenishment plan",
      ],
      portfolioHighlights: [
        "Gas detector fleet contract across six vessels.",
        "PPE re-stocking programme for a port stevedoring operator.",
      ],
      contractTerms:
        "Gadget supply is billed by line item with documented OEM provenance. Servicing is billed per item per year with replacement parts at cost. " +
        STANDARD_TERMS,
      iconKey: "HardHat",
      sortOrder: 5,
    },
    {
      slug: "diving-and-equipment",
      title: "Diving & Equipment",
      tagline: "Commercial diving support, hull surveys, and underwater repair.",
      description:
        "Commercial diving operations for hull surveys, propeller polishing, anode replacement, underwater welding, and class-approved in-water surveys (IWS) in lieu of dry-docking. Diving spreads, decompression chambers, and dive supervisor coverage included.",
      deliverables: [
        "IWS report stamped by an approved class surveyor",
        "Hull cleaning and propeller polishing log",
        "Underwater welding and patch reports",
      ],
      portfolioHighlights: [
        "IWS for a Suezmax tanker at the Lagos anchorage.",
        "Underwater patch repair on a coastal supply vessel.",
      ],
      contractTerms:
        "Dive operations are billed per dive day with a minimum mobilisation. All work follows IMCA D014 standards and a dive risk assessment signed by the master and dive supervisor. " +
        STANDARD_TERMS,
      iconKey: "LifeBuoy",
      sortOrder: 6,
    },
    {
      slug: "offshore-and-exportation",
      title: "Offshore & Exportation",
      tagline: "Offshore project support and export logistics.",
      description:
        "Offshore project supervision and export logistics: rig-tender coordination, FPSO mobilisation support, crew rotation logistics, and the export of overhauled engines and refurbished marine equipment. We handle exporter documentation, hard-currency repatriation, and bonded warehousing.",
      deliverables: [
        "Offshore mobilisation plan and supervisor coverage",
        "Export documentation and customs filings",
        "Bonded storage and onward shipping",
      ],
      portfolioHighlights: [
        "FPSO mobilisation support for a deepwater operator.",
        "Export of two refurbished marine generators to a West-African neighbour.",
      ],
      contractTerms:
        "Offshore engagements are billed per crew-day plus mobilisation. Export contracts are FOB Lagos unless otherwise agreed and require pre-payment of customs duty. " +
        STANDARD_TERMS,
      iconKey: "Ship",
      sortOrder: 7,
    },
  ]);

  await db.insert(landmarksTable).values([
    {
      name: "Sweet Sensation, Ejigbo",
      category: "restaurant",
      starRating: 3,
      latitude: 6.547,
      longitude: 3.305,
      directionsHint:
        "Drive past Sweet Sensation on Ejigbo road, then turn left onto Idimu Road; the office is the second blue gate on the right.",
    },
    {
      name: "Mr Bigg's Ejigbo",
      category: "restaurant",
      starRating: 2,
      latitude: 6.5505,
      longitude: 3.2999,
      directionsHint:
        "From Mr Bigg's, head south down Idimu Road for 600 m. The office is on the right, opposite the petrol station.",
    },
    {
      name: "The Place Restaurant, NNPC Ejigbo",
      category: "restaurant",
      starRating: 4,
      latitude: 6.5455,
      longitude: 3.2932,
      directionsHint:
        "From The Place, head north on Idimu Road for about 700 m. The office is just before the Idimu/Ejigbo junction.",
    },
    {
      name: "Chicken Republic Ejigbo",
      category: "restaurant",
      starRating: 3,
      latitude: 6.5519,
      longitude: 3.2945,
      directionsHint:
        "From Chicken Republic, drive south for 800 m down Idimu Road. The office sign is visible on the left.",
    },
    {
      name: "KFC Egbeda",
      category: "restaurant",
      starRating: 4,
      latitude: 6.5582,
      longitude: 3.301,
      directionsHint:
        "From KFC Egbeda, take Idimu Road south for about 1.4 km. The office is the second compound past the secondary school.",
    },
  ]);

  // Seed a couple of example service requests so the dashboard isn't empty.
  const [reqA] = await db
    .insert(serviceRequestsTable)
    .values({
      serviceSlug: "marine-engineering",
      serviceTitle: "Marine Engineering",
      purchaserName: "Adebayo Okafor",
      purchaserEmail: "adebayo.okafor@example.com",
      purchaserPhone: "+234 803 555 0102",
      purchaserCompany: "West Star Maritime Ltd.",
      projectAddress: "Apapa Port, Lagos",
      projectDescription:
        "Top-end overhaul of a CAT 3512 main engine on our crew transfer vessel.",
      estimatedBudget: 18000,
      startDate: "2026-05-15",
      contractTermsAccepted: true,
      status: "reviewing",
    })
    .returning();

  const [reqB] = await db
    .insert(serviceRequestsTable)
    .values({
      serviceSlug: "maritime-safety",
      serviceTitle: "Maritime Safety",
      purchaserName: "Ngozi Eze",
      purchaserEmail: "n.eze@coastalship.test",
      purchaserPhone: "+234 802 555 0149",
      purchaserCompany: "Coastal Ship Operators",
      projectAddress: "Tin Can Anchorage, Lagos",
      projectDescription:
        "ISM internal audit ahead of NIMASA inspection in two weeks.",
      estimatedBudget: 4500,
      startDate: "2026-05-05",
      contractTermsAccepted: true,
      status: "contracted",
    })
    .returning();

  await db.insert(messagesTable).values([
    {
      serviceRequestId: reqA.id,
      direction: "outbound",
      subject: "Site survey scheduled",
      body: "Hello Mr. Okafor — our engineering lead will be at Apapa Port on Friday at 09:00 to survey the engine. Please confirm yard access.",
      recipientEmail: reqA.purchaserEmail,
    },
    {
      serviceRequestId: reqB.id,
      direction: "outbound",
      subject: "Audit dates confirmed",
      body: "Dear Ms. Eze — confirming our auditor will board on 5 May. Please share the latest ISM manual and crew roster.",
      recipientEmail: reqB.purchaserEmail,
    },
  ]);

  await db.insert(paymentRequestsTable).values([
    {
      serviceRequestId: reqB.id,
      purchaserName: reqB.purchaserName,
      purchaserEmail: reqB.purchaserEmail,
      amountCents: 135000,
      currency: "usd",
      description: "ISM internal audit — first milestone (30%).",
      status: "paid",
      paidAt: new Date(),
    },
  ]);

  await db.insert(auditLogTable).values([
    {
      action: "service_request.created",
      entityType: "service_request",
      entityId: reqA.id,
      actor: reqA.purchaserEmail,
      details: `New ${reqA.serviceTitle} request from ${reqA.purchaserName}`,
    },
    {
      action: "service_request.created",
      entityType: "service_request",
      entityId: reqB.id,
      actor: reqB.purchaserEmail,
      details: `New ${reqB.serviceTitle} request from ${reqB.purchaserName}`,
    },
    {
      action: "payment.created",
      entityType: "payment_request",
      entityId: 1,
      actor: "admin",
      details: `Payment request for ${reqB.purchaserEmail}: 1350.00 USD — ISM internal audit milestone 1`,
    },
  ]);

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
