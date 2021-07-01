export interface User {
	username: string;
	displayName: string;
	token: string;
	image?: string;
}

export interface UserFormValues {
	email: string;
	password: string;
	displayName?: string;
	username?: string;
	commonFormError?: string;
}

export class DefaultUserFormValues implements UserFormValues {
	email = '';
	password = '';
	displayName?: string | undefined = '';
	username?: string | undefined = '';
	commonFormError?: string | undefined = '';
}
