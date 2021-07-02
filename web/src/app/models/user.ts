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
	public email = '';
	public password = '';
	public displayName?: string | undefined = '';
	public username?: string | undefined = '';
	public commonFormError?: string | undefined = '';
}
