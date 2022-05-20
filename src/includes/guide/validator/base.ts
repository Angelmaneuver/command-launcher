export class BaseValidator {
	public static async validateRequired(value: string): Promise<string | undefined> {
		if (!(value) || value.length === 0) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve("Required field.");
			});
		} else {
			return undefined;
		}
	}
}
