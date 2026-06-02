import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from "path"
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const _dirname = path.resolve()
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes )

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "../whispr-client/dist")))

    app.get("*splat", (_, res) => {
        res.sendFile(path.resolve(_dirname, "../whispr-client", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});