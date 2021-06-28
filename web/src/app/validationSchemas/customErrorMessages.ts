export default {
	email: {
		required: 'Email jest wymagany',
		valid: 'Email musi być prawidłowym adresem email.'
	},
	password: {
		required: 'Hasło jest wymagane',
		complex:
			'Hasło musi zawierać conajmniej jedną małą literę, jedną wielką oraz jedną liczbę.',
		min: (n: number): string => `Hasło musi mieć conajmniej ${n} znaków długości.`
	},
	common: {
		failedLogin: 'Nieprawidłowy email lub hasło.',
		failedAdd: 'Wystąpił problem przy dodawaniu roadmapy.',
		failedAddMilestone: 'Wystąpił problem przy dodawaniu milestone.',
		failedAddImage: 'Wystąpił problem przy dodawaniu zdjęcia.'
	},
	username: {
		required: 'Nazwa użytkownika jest wymagana'
	},
	name: {
		required: 'Nazwa roadmapy jest wymagana',
		requiredMilestone: 'Nazwa milestone jest wymagana',
		max: (n: number): string => `Maksymalna długość nazwy to ${n} znaków`
	},
	description: {
		max: (n: number): string => `Maksymalna długość opisu to ${n} znaków`
	},
	startsOn: {
		required: 'Data początku roadmapy jest wymagana'
	},
	endsOn: {
		failedTime: 'Data końca nie może wystąpić przed datą początka.',
		requiredMilestone: 'Data końca milestone jest wymagana'
	},
	file: {
		size: {
			fileTooLarge: `Plik jest zbyt duży. Maksymalna wielkość pliku to ${process.env.REACT_APP_FILE_SIZE}`
		},
		format: {
			unsupportedFormat: 'Wskazany format pliku nie jest wspierany.'
		},
		required: 'Plik jest wymagany!'
	}
};
