const common = {
  appName: 'Roadmap',
  get welcomeMessage () {
    return `Welcome to ${this.appName}`;
  },
  welcomeButton: 'Go to dashboard'
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
    }
  }
};

const pages = {
  notFound: {
    message: 'Sorry. We could not find what you were looking for 😟.'
  },
  dashboard: {
    greeting: 'Hello, '
  }
};

const defaultDict = {
  common,
  pages,
  forms
};

export default defaultDict;
