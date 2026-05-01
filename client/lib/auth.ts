export type UserRole = "farmer" | "officer" | "admin";

export type AuthUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  province?: string;
  district?: string;
  isActive?: boolean;
};

const TOKEN_KEY = "agri_token";
const ROLE_KEY = "agri_role";
const USER_KEY = "agri_user";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

export const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");

  const foundCookie = cookies.find((cookie) =>
    cookie.startsWith(`${name}=`)
  );

  if (!foundCookie) return null;

  return decodeURIComponent(foundCookie.split("=")[1]);
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

export const saveAuthData = ({
  token,
  role,
  user,
}: {
  token: string;
  role: UserRole;
  user: AuthUser;
}) => {
  setCookie(TOKEN_KEY, token);
  setCookie(ROLE_KEY, role);

  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => {
  return getCookie(TOKEN_KEY);
};

export const getRole = () => {
  return getCookie(ROLE_KEY) as UserRole | null;
};

export const getAuthUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuthData = () => {
  deleteCookie(TOKEN_KEY);
  deleteCookie(ROLE_KEY);

  localStorage.clear();
  sessionStorage.clear();
};

export const getDashboardPathByRole = (role: UserRole | null) => {
  if (role === "admin") return "/admin";
  if (role === "officer") return "/officer";
  return "/farmer";
};