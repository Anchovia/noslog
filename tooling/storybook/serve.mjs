import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.env.STORYBOOK_STATIC_DIR ?? "storybook-static");
const port = Number(process.env.STORYBOOK_VISUAL_PORT ?? 6010);
const mime = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
};
const server = createServer(async (request, response) => {
    try {
        const pathname = decodeURIComponent(
            new URL(request.url ?? "/", "http://localhost").pathname
        );
        const file = resolve(
            root,
            `.${pathname === "/" ? "/index.html" : pathname}`
        );
        if (!file.startsWith(root + sep)) {
            response.writeHead(403).end();
            return;
        }
        if (!(await stat(file)).isFile()) {
            response.writeHead(404).end();
            return;
        }
        response.writeHead(200, {
            "Content-Type": mime[extname(file)] ?? "application/octet-stream",
            "Cache-Control": "no-store",
        });
        createReadStream(file).pipe(response);
    } catch {
        response.writeHead(404).end();
    }
});
server.listen(port, "127.0.0.1", () =>
    process.stdout.write(`Storybook visual server: ${port}\n`)
);
for (const signal of ["SIGINT", "SIGTERM"])
    process.on(signal, () => server.close(() => process.exit(0)));
