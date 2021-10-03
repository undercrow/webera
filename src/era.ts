import * as era from "erajs";
import JSZip, {JSZipObject} from "jszip";

export async function compile(zip: JSZip): Promise<era.VM> {
	const erh: string[] = [];
	const erb: string[] = [];
	const data = new Map<string, string>();
	for (const zipObj of Object.values(zip.files)) {
		const name = zipObj.name;
		if (name.startsWith("ERB/") && (name.endsWith(".erh") || name.endsWith(".ERH"))) {
			erh.push(await zipObj.async("text"));
		} else if (name.startsWith("ERB/") && (name.endsWith(".erb") || name.endsWith(".ERB"))) {
			erb.push(await zipObj.async("text"));
		} else if (name.startsWith("CSV/") && (name.endsWith(".csv") || name.endsWith(".CSV"))) {
			data.set(name, await zipObj.async("text"));
		}
	}

	return era.compile(erh, erb, data);
}

export async function hash(zip: JSZip): Promise<string> {
	const files = new Map<string, JSZipObject>();
	for (const zipObj of Object.values(zip.files)) {
		const name = zipObj.name;
		if (
			(name.startsWith("ERB/") && (name.endsWith(".erh") || name.endsWith(".ERH"))) ||
			(name.startsWith("ERB/") && (name.endsWith(".erb") || name.endsWith(".ERB"))) ||
			(name.startsWith("CSV/") && (name.endsWith(".csv") || name.endsWith(".CSV")))
		) {
			files.set(name, zipObj);
		}
	}

	const keys = [...files.keys()];
	keys.sort();
	let content = "";
	for (const key of keys) {
		content += `####${key}####` + "\n" + await files.get(key)!.async("text") + "\n";
	}
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
	const arr = Array.from(new Uint8Array(digest));
	return arr.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
