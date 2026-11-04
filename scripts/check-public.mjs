import { execFileSync } from "node:child_process";
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const forbidden = /(^legacy-html\/|^\.agent\/|(^|\/)__pycache__\/|(^|\/)backend\/data\/|(^|\/)(pgpass\.txt|credentials\.json|token\.json)$|\.(pdf|docx|xlsx|zip|7z)$|^public\/assets\/pulse\/)/i;
const rejected = files.filter(path => forbidden.test(path));
if (rejected.length) { console.error("Private or obsolete files are tracked:", rejected.join("\n")); process.exit(1); }
console.log("Public source boundary passed.");
