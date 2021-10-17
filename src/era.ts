import * as era from "erajs";
import JSZip from "jszip";

export async function compile(zip: JSZip): Promise<era.VM> {
	const files = new Map<string, string>();
	await Promise.all(Object.values(zip.files).map(async (zipObj) => {
		const name = zipObj.name;
		if (
			(name.startsWith("ERB/") && (name.endsWith(".erh") || name.endsWith(".ERH"))) ||
			(name.startsWith("ERB/") && (name.endsWith(".erb") || name.endsWith(".ERB"))) ||
			(name.startsWith("CSV/") && (name.endsWith(".csv") || name.endsWith(".CSV")))
		) {
			files.set(name.split("/").pop()!, await zipObj.async("text"));
		}
	}));

	return era.compile(files);
}

export async function hash(zip: JSZip): Promise<string> {
	const files = new Map<string, string>();
	await Promise.all(Object.values(zip.files).map(async (zipObj) => {
		const name = zipObj.name;
		if (
			(name.startsWith("ERB/") && (name.endsWith(".erh") || name.endsWith(".ERH"))) ||
			(name.startsWith("ERB/") && (name.endsWith(".erb") || name.endsWith(".ERB"))) ||
			(name.startsWith("CSV/") && (name.endsWith(".csv") || name.endsWith(".CSV")))
		) {
			files.set(name, await zipObj.async("text"));
		}
	}));

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
