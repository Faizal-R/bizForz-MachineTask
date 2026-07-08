export const ApiRoutes = {
  Auth: {
    SIGNIN: "/auth/signin",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  Projects: {
    GET_ALL: "/projects",
    CREATE: "/projects",
    UPDATE: (projectId: string) => `/projects/${projectId}`,
    DELETE: (projectId: string) => `/projects/${projectId}`,
  },
  Users: {
    GET_ALL: "/users",
    CREATE: "/users",
    UPDATE_PERMISSIONS: (userId: string) => `/users/${userId}/permissions`,
    UPDATE_ROLE: (userId: string) => `/users/${userId}/role`,
  },
  Roles: {
    GET_ALL: "/roles",
    CREATE: "/roles",
    UPDATE: (roleId: string) => `/roles/${roleId}`,
    DELETE: (roleId: string) => `/roles/${roleId}`,
  },
};

export default ApiRoutes;
