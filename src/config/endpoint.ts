const RESOURCES = {
  auth: 'users',
  blogs: 'posts',
};

export const ENDPOINT = {
  auth: {
    index: `${RESOURCES.auth}`,
    login: `${RESOURCES.auth}/login`,
    register: `${RESOURCES.auth}/register`,
    userInfo: `${RESOURCES.auth}/me`,
  },
  blogs: {
    blogsList: `${RESOURCES.blogs}`,
  },
};
