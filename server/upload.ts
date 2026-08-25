import "dotenv/config";
import express from "express";
import cors from "cors";
import { createUploadthing, createRouteHandler } from "uploadthing/express";

const app = express();
app.use(cors());

const f = createUploadthing();

const fileRouter = {
  imageUploader: f({ "image/*": { maxFileSize: "8MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url, name: file.name };
    }),
};

app.use("/api/uploadthing", createRouteHandler({ router: fileRouter }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.UPLOAD_PORT || 3456;
app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
});
