const USERS_KEY = "athlete-manager-users";
const AUTH_USER_KEY = "athlete-manager-auth";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getStoredUsers = () => safeParse(localStorage.getItem(USERS_KEY)) || [];
export const saveStoredUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const getAuthUser = () => safeParse(localStorage.getItem(AUTH_USER_KEY));
export const setAuthUser = (user) => localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
export const clearAuthUser = () => localStorage.removeItem(AUTH_USER_KEY);

export const isAuthenticated = () => !!getAuthUser();

export const loginUser = (username, password) => {
  const users = getStoredUsers();
  return users.find((user) => user.username === username && user.password === password) || null;
};

export const registerUser = ({ username, email, password, role = "atleta" }) => {
  const users = getStoredUsers();

  if (users.some((user) => user.username === username)) {
    return { success: false, error: "Nome de usuário já existe." };
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    role,
  };

  users.push(newUser);
  saveStoredUsers(users);

  return { success: true, user: newUser };
};
