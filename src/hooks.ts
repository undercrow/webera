import {useState} from "preact/hooks";

export function useLocalStorage<T>(key: string, initial: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item != null ? (JSON.parse(item) as T) : initial;
		} catch (error) {
			return initial;
		}
	});

	const setValue = (value: T) => {
		setStoredValue(value);
		window.localStorage.setItem(key, JSON.stringify(value));
	};

	return [storedValue, setValue];
}
