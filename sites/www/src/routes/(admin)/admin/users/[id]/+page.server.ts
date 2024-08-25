import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { get_active_roles } from '$lib/server/db/role.js';
import { get_user, update_user } from '$lib/server/db/user.js';
import { schema } from './schema';

export const load = async ({ params }) => {
	const user = get_user(parseInt(params.id));
	const roles = get_active_roles();

	if (!user) {
		redirect(302, '/admin/users');
	}

	const form = await superValidate(user, zod(schema));

	return {
		user: user,
		roles: roles.map((r) => ({ ...r, label: r.name, value: r.id })),
		form
	};
};
export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const updated_user = await update_user(form.data.id as number, form.data);

		redirect(302, '/admin/users');
	}
};
