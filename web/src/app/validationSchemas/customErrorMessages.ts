export default {
  email: {
    required: 'Email is required'
  },
  password: {
    required: 'Password is required',
    complex:
      'Password must contain at least one uppercase letter, one lowercase letter and one number'
  },
  common: {
    failedLogin: 'Invalid email or password.',
    failedAdd: 'Invalid name or start date of roadmap'
  },
  username: {
    required: 'Username is required'
  },
  name: {
    required: 'Roadmap name is required'
  },
  startsOn: {
    required: 'Roadmap start date is required'
  }
};
