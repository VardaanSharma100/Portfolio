const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const npmExecPath = process.env.npm_execpath;
const nodeExecPath = process.execPath;

const projectFrontends = [
    {
        slug: "deepfake-detection",
        dir: path.join(rootDir, "projects", "Deepfake-Detection"),
        aliases: ["deepfake"],
    },
    {
        slug: "sign-language-translation",
        dir: path.join(rootDir, "projects", "Sign Language Translation"),
        aliases: ["signlanguage", "sign-language"],
    },
    {
        slug: "find-song-by-singing",
        dir: path.join(rootDir, "projects", "Hum to Search"),
        aliases: ["findsong", "songfinder"],
    },
    {
        slug: "cab-demand-forecasting",
        dir: path.join(rootDir, "projects", "Cab Demand Forecasting"),
        aliases: ["cabdemand"],
    },
    {
        slug: "multilingual-news-detector",
        dir: path.join(rootDir, "projects", "Fake News Detector in Indian Languages"),
        aliases: ["newsdetector"],
    },
    {
        slug: "ai-research-assistant",
        dir: path.join(rootDir, "projects", "AI-Research-assistant"),
        aliases: ["airesearch"],
    },
];

function run(command, args, cwd, useShell = false) {
    const result = spawnSync(command, args, {
        cwd,
        stdio: "inherit",
        env: process.env,
        shell: useShell,
    });

    if (result.error) {
        console.error(`[build-project-apps] Failed to spawn ${command}:`, result.error.message);
        return false;
    }

    return result.status === 0;
}

function runNpm(args, cwd) {
    if (npmExecPath) {
        return run(nodeExecPath, [npmExecPath, ...args], cwd);
    }

    const fallbackNpm = process.platform === "win32" ? "npm.cmd" : "npm";
    return run(fallbackNpm, args, cwd, process.platform === "win32");
}

function ensureDependencies(frontendDir) {
    const nodeModulesPath = path.join(frontendDir, "node_modules");
    if (fs.existsSync(nodeModulesPath)) {
        return true;
    }

    const lockFile = path.join(frontendDir, "package-lock.json");
    const installArgs = fs.existsSync(lockFile)
        ? ["ci", "--no-audit", "--no-fund"]
        : ["install", "--no-audit", "--no-fund"];

    console.log(`[build-project-apps] Installing dependencies in ${frontendDir}`);
    return runNpm(installArgs, frontendDir);
}

function copyDirectory(sourceDir, targetDir) {
    fs.mkdirSync(targetDir, { recursive: true });
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const targetPath = path.join(targetDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    }
}

function injectReloadRedirect(indexHtmlPath) {
    if (!fs.existsSync(indexHtmlPath)) {
        return;
    }

    const marker = "data-refresh-home-redirect";
    let html = fs.readFileSync(indexHtmlPath, "utf8");

    if (html.includes(marker)) {
        return;
    }

    const redirectScript = [
        "<script data-refresh-home-redirect>",
        "(function () {",
        "  try {",
        "    var nav = performance.getEntriesByType && performance.getEntriesByType(\"navigation\")[0];",
        "    var isReload = nav && nav.type === \"reload\";",
        "    if (isReload && window.location.pathname !== \"/\") {",
        "      window.location.replace(\"/\");",
        "    }",
        "  } catch (e) {}",
        "})();",
        "</script>",
    ].join("\n");

    if (html.includes("</head>")) {
        html = html.replace("</head>", `${redirectScript}\n</head>`);
    } else {
        html = `${redirectScript}\n${html}`;
    }

    fs.writeFileSync(indexHtmlPath, html, "utf8");
}

function buildProjectFrontend(project) {
    const outDir = path.join(rootDir, "public", project.slug, "running");
    const aliasSlugs = new Set([
        project.slug.replace(/-/g, ""),
        ...(project.aliases || []),
    ]);
    aliasSlugs.delete(project.slug);
    const aliasOutDirs = Array.from(aliasSlugs).map((alias) =>
        path.join(rootDir, "public", alias, "running")
    );

    if (!fs.existsSync(path.join(project.dir, "package.json"))) {
        throw new Error(`Missing package.json for ${project.slug} at ${project.dir}`);
    }

    if (!ensureDependencies(project.dir)) {
        throw new Error(`Dependency installation failed for ${project.slug}`);
    }

    fs.rmSync(outDir, { recursive: true, force: true });
    for (const aliasOutDir of aliasOutDirs) {
        if (aliasOutDir !== outDir) {
            fs.rmSync(aliasOutDir, { recursive: true, force: true });
        }
    }

    const buildArgs = [
        "run",
        "build",
        "--",
        "--base",
        `/${project.slug}/running/`,
        "--outDir",
        outDir,
    ];

    console.log(`[build-project-apps] Building ${project.slug}`);
    const ok = runNpm(buildArgs, project.dir);
    if (!ok) {
        throw new Error(`Build failed for ${project.slug}`);
    }

    injectReloadRedirect(path.join(outDir, "index.html"));

    for (const aliasOutDir of aliasOutDirs) {
        if (aliasOutDir !== outDir) {
            copyDirectory(outDir, aliasOutDir);
        }
    }
}

function main() {
    fs.mkdirSync(path.join(rootDir, "public"), { recursive: true });
    fs.rmSync(path.join(rootDir, "public", "apps"), {
        recursive: true,
        force: true,
    });

    for (const project of projectFrontends) {
        buildProjectFrontend(project);
    }

    console.log(`[build-project-apps] Finished building ${projectFrontends.length} project apps.`);
}

main();