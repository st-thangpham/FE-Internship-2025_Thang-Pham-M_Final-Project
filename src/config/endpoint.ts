const RESOURCES = {
  auth: 'users',
  blogs: 'posts',
};

export const ENDPOINT = {
  auth: {
    index: `${RESOURCES.auth}`,
    login: `${RESOURCES.auth}/login`,
    register: `${RESOURCES.auth}/register`,
  },
  blogs: {
    blogsList: `${RESOURCES.blogs}`,
  },
};
