import type { TypedPocketBase } from "$lib/pocketbase-types";
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: TypedPocketBase
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
