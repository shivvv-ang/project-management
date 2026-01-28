import "dotenv/config"
import express  from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import { config } from "./configs/app.config.js";
import connectDb from "./configs/database.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import "./configs/passport.config.js";
import passport from "passport";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.routes.js";
import isAuthenticated from "./middlewares/isAuthenticated.middleware.js";
import workspaceRoutes from "./routes/workspace.route.js";
import memberRoutes from "./routes/member.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(
    session({
        name: "session",
        secret: config.SESSION_SECRET, 
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
  );
  

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin:config.FRONTEND_ORIGIN,
        credentials:true,
    })
)

app.use(`${BASE_PATH}/auth`,authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated,userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

const startServer = async () => {
    await connectDb();
    app.listen(config.PORT, () => {
        console.log(`Server running on ${config.PORT}`);
    });
};

startServer();