import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import {
  db,
  businessProfileTable,
  skillsTable,
  servicesTable,
  landmarksTable,
} from "@workspace/db";
import {
  GetBusinessProfileResponse,
  ListSkillsResponse,
  ListServicesResponse,
  GetServiceParams,
  GetServiceResponse,
  ListLandmarksResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/portfolio/profile", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(businessProfileTable).limit(1);
  if (!profile) {
    res.status(404).json({ error: "Business profile not found" });
    return;
  }
  res.json(GetBusinessProfileResponse.parse(profile));
});

router.get("/portfolio/skills", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(skillsTable)
    .orderBy(asc(skillsTable.sortOrder), asc(skillsTable.id));
  res.json(ListSkillsResponse.parse(rows));
});

router.get("/portfolio/services", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.sortOrder), asc(servicesTable.id));
  res.json(ListServicesResponse.parse(rows));
});

router.get("/portfolio/services/:slug", async (req, res): Promise<void> => {
  const params = GetServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.slug, params.data.slug));
  if (!row) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(GetServiceResponse.parse(row));
});

router.get("/portfolio/landmarks", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(landmarksTable)
    .orderBy(asc(landmarksTable.id));
  res.json(ListLandmarksResponse.parse(rows));
});

export default router;
