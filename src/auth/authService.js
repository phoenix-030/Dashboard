const storage = {
  USERS: 'app_users',
  SESSION: 'app_session'
};

export const authService = {

  // Get all users from localStorage
  getUsers() {
    const users = localStorage.getItem(storage.USERS);
    return users ? JSON.parse(users) : [];
  },

  // Save users to localStorage
  saveUsers(users) {
    localStorage.setItem(storage.USERS, JSON.stringify(users));
  },

  // Get current session (FROM sessionStorage)
  getSession() {
    const session = sessionStorage.getItem(storage.SESSION);
    return session ? JSON.parse(session) : null;
  },

  // Save session (TO sessionStorage)
  saveSession(session) {
    sessionStorage.setItem(storage.SESSION, JSON.stringify(session));
  },

  // Clear session when logout
  clearSession() {
    sessionStorage.removeItem(storage.SESSION);
  },

  // Check authentication
  isAuthenticated() {
    const session = this.getSession();
    return session && session.isAuthenticated === true;
  },

  // Signup new user
  signUp(name, email, password) {
    const users = this.getUsers();

    // email already exists check
    if (users.find(user => user.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    // Return user info without creating session
    return {
      success: true,
      message: 'Account created successfully. Please login.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    };
  },

  // Login user
  login(email, password) {
    const users = this.getUsers();

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAuthenticated: true,
      loginAt: new Date().toISOString()
    };

    this.saveSession(session);

    return session;
  },

  // Logout 
  logout() {
    this.clearSession();
  }
};