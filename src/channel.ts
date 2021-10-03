export default class Channel<T> {
	private queue: T[];
	private resolve?: (value: T) => void;

	public constructor() {
		this.queue = [];
	}

	public push(value: T): void {
		if (this.resolve == null) {
			this.queue.push(value);
		} else {
			this.resolve(value);
			this.resolve = undefined;
		}
	}

	public async pop(): Promise<T> {
		if (this.queue.length !== 0) {
			return this.queue.pop()!;
		} else {
			return new Promise<T>((res) => {
				this.resolve = res;
			});
		}
	}
}
