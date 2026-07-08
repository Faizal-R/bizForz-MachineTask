import { Router } from "express";
import authRoutes from "./auth.routes.js";
import roleRoutes from "./roles.routes.js";
import projectRoutes from "./projects.routes.js";
import userRoutes from "./user.routes.js";
import permissionRoutes from "./permissions.routes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/permissions", permissionRoutes);

export default router;
