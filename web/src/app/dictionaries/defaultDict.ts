const common = {
  appName: 'Roadmap',
  welcomeMessage: 'Witaj w',
  welcomeButton: 'Idź na dashboard',
  backButton: 'Powrót',
  or: 'lub'
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
    }
  },
  buttons: {
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
    addNew: {
      text: 'Dodaj nową roadmapę'
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
  }
};

const defaultDict = {
  common,
  pages,
  forms
};

export default defaultDict;
