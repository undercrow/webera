import {useEffect} from "preact/hooks";

export function useAsyncEffect(
	effect: () => Promise<any>,
	deps?: Parameters<typeof useEffect>[1],
) {
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	useEffect(() => { effect(); }, deps);
}
