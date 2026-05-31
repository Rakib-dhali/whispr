import express from 'express';
import dotenv from 'dotenv';
import path from "path"

dotenv.config();

const app = express();
const _dirname = path.resolve()
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "../whispr-client/dist")))

    app.get("*splat", (_, res) => {
        res.sendFile(path.resolve(_dirname, "../whispr-client", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});