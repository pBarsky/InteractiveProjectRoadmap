const common = {
  appName: 'Roadmap',
  welcomeMessage: 'Welcome to',
  welcomeButton: 'Go to dashboard',
  backButton: 'Back'
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
      placeholder: 'Password',
      labelText: 'Password'
    },
    username: {
      name: 'username',
      label: 'username',
      placeholder: 'Username',
      labelText: 'Username'
    },
    displayName: {
      name: 'displayName',
      label: 'displayName',
      placeholder: 'Display Name',
      labelText: 'Display name'
    },
    name: {
      name: 'name',
      label: 'name',
      placeholder: 'Name',
      labelText: 'Name'
    },
    description: {
      name: 'description',
      label: 'description',
      placeholder: 'Description',
      labelText: 'Description'
    },
    startsOn: {
      name: 'startsOn',
      label: 'startsOn',
      placeholder: 'Starts On',
      labelText: 'Starts On'
    },
    endsOn: {
      name: 'endsOn',
      label: 'endsOn',
      placeholder: 'Ends On',
      labelText: 'Ends On'
    }
  },
  buttons: {
    register: {
      text: 'Register'
    },
    login: {
      text: 'Login'
    },
    dashboard: {
      text: 'Dashboard'
    },
    logout: {
      text: 'Logout'
    },
    add: {
      text: 'Add'
    },
    addNew: {
      text: 'Add new roadmap'
    }
  }
};

const pages = {
  notFound: {
    message: 'Sorry. We could not find what you were looking for 😟.'
  },
  dashboard: {
    greeting: 'Hello, ',
    loading: 'Loading roadmaps...'
  },
  roadmap: {
    startsOn: 'Starts on: ',
    endsOn: 'Ends on: ',
    noRoadmaps: 'You dont have any roadmaps yet...',
    proposalOfCreation: 'How about you make a new one? 😸',
    roadmapLate: 'You are late... 😥',
    loadingDetails: 'Loading roadmap...'
  }
};

const defaultDict = {
  common,
  pages,
  forms
};

export default defaultDict;
