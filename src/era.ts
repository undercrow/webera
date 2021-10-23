import * as era from "erajs";
import JSZip from "jszip";

export async function extract(zip: JSZip): Promise<Map<string, string>> {
	const csvDir = Object.values(zip.files).find((zipObj) => zipObj.dir && (
		zipObj.name.toUpperCase() === "CSV" ||
		zipObj.name.toUpperCase() === "CSV/" ||
		zipObj.name.toUpperCase().endsWith("/CSV") ||
		zipObj.name.toUpperCase().endsWith("/CSV/")
	));
	if (csvDir == null) {
		throw new Error("CSV folder is not found");
	}

	const erbDir = Object.values(zip.files).find((zipObj) => zipObj.dir && (
		zipObj.name.toUpperCase() === "ERB" ||
		zipObj.name.toUpperCase() === "ERB/" ||
		zipObj.name.toUpperCase().endsWith("/ERB") ||
		zipObj.name.toUpperCase().endsWith("/ERB/")
	));
	if (erbDir == null) {
		throw new Error("ERB folder is not found");
	}

	const files = new Map<string, string>();
	await Promise.all(Object.values(zip.files).map(async (zipObj) => {
		if (!zipObj.name.startsWith(csvDir.name) && !zipObj.name.startsWith(erbDir.name)) {
			return;
		}

		files.set(zipObj.name.split("/").pop()!, await zipObj.async("text"));
	}));

	return files;
}

export function compile(files: Map<string, string>): era.VM {
	return era.compile(files);
}

export async function hash(files: Map<string, string>): Promise<string> {
	const keys = [...files.keys()];
	keys.sort();
	let content = "";
	for (const key of keys) {
		content += `####${key}####` + "\n" + files.get(key)! + "\n";
	}
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
	const arr = Array.from(new Uint8Array(digest));
	return arr.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
