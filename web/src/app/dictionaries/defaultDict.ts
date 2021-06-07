import { Status } from '../models/milestone';

const common = {
	appName: 'Roadmap',
	welcomeMessage: 'Witaj w',
	welcomeButton: 'Idź na dashboard',
	backButton: 'Powrót',
	or: 'lub',
	status: {
		[Status.New]: 'Nowy',
		[Status.InProgress]: 'W trakcie',
		[Status.Done]: 'Zakończony'
	}
};

const errors = {
	roadmap: {
		failedEdit: 'Nie udało się zaktualizować roadmapy.',
		failedDelete: 'Nie udało się usunąć roadmapy.'
	},
	milestones: {
		failedEdit: "Nie udało się zaktualizować milestone'a.",
		failedDelete: "Nie udało się usunąć milestone'a."
	}
};

const forms = {
	inputs: {
		email: {
			name: 'email',
			label: 'email',
			placeholder: 'Email',
			labelText: 'Email'
		},
		password: {
			name: 'password',
			label: 'password',
			placeholder: 'Hasło',
			labelText: 'Hasło'
		},
		username: {
			name: 'username',
			label: 'username',
			placeholder: 'Nazwa użytkownika',
			labelText: 'Nazwa użytkownika'
		},
		displayName: {
			name: 'displayName',
			label: 'displayName',
			placeholder: 'Nazwa wyświetlana',
			labelText: 'Nazwa wyświetlana'
		},
		name: {
			name: 'name',
			label: 'name',
			placeholder: 'Nazwa',
			labelText: 'Nazwa'
		},
		description: {
			name: 'description',
			label: 'description',
			placeholder: 'Opis',
			labelText: 'Opis'
		},
		startsOn: {
			name: 'startsOn',
			label: 'startsOn',
			placeholder: 'Rozpoczyna się',
			labelText: 'Rozpoczyna się'
		},
		endsOn: {
			name: 'endsOn',
			label: 'endsOn',
			placeholder: 'Kończy się',
			labelText: 'Kończy się'
		},
		status: {
			name: 'status',
			label: 'status',
			placeholder: 'Status',
			labelText: 'Status'
		}
	},
	buttons: {
		edit: {
			text: 'Edytuj'
		},
		delete: {
			text: 'Usuń'
		},
		register: {
			text: 'Zarejestruj'
		},
		login: {
			text: 'Zaloguj'
		},
		dashboard: {
			text: 'Dashboard'
		},
		logout: {
			text: 'Wyloguj'
		},
		add: {
			text: 'Dodaj'
		},
		addNewMilestone: {
			text: "Dodaj nowego milestone'a"
		},
		addNewRoadmap: {
			text: 'Dodaj nową roadmapę'
		},
		returnToDashboard: {
			text: 'Powrót na dashboard'
		},
		returnToHomepage: {
			text: 'Powrót na stronę główną'
		}
	}
};

const pages = {
	notFound: {
		message: 'Przykro nam. Nie mogliśmy znaleźć tego, czego szukałeś 😟.'
	},
	dashboard: {
		greeting: 'Witaj, ',
		loading: 'Wczytywanie roadmap...'
	},
	roadmap: {
		startsOn: 'Rozpoczyna się: ',
		endsOn: 'Kończy się: ',
		noRoadmaps: 'Nie masz jeszcze żadnych roadmap...',
		proposalOfCreation: 'Może chcesz zrobić nową? 😸',
		roadmapLate: 'Jesteś spóźniony... 😥',
		loadingDetails: "Wczytywanie roadmap'y..."
	},
	milestone: {
		name: 'Nazwa: ',
		endsOn: 'Kończy się: ',
		status: 'Status: ',
		noMilestones: 'Nie masz jeszcze żadnych milestone`ów dla tej roadmapy...'
	}
};

const defaultDict = {
	common,
	pages,
	forms,
	errors
};

export default defaultDict;
