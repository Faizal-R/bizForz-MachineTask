import { Router } from "express";
import authRoutes from "./auth.routes";
import roleRoutes from "./roles.routes";
import projectRoutes from "./projects.routes";
import userRoutes from "./user.routes";
import permissionRoutes from "./permissions.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/permissions", permissionRoutes);

export default router;
