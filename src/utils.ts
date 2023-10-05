export function isInteger(input: string): boolean {
	return input?.match(/^\d+$/) !== null;
}
