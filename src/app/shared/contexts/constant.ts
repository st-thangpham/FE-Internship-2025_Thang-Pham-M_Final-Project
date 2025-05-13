export const ACCESS_TOKEN_KEY = 'token';

export const tags = [
  'React',
  'JavaScript',
  'CSS',
  'HTML',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'Programming',
  'Self Improvement',
  'Data Science',
  'Writing',
  'Relationships',
  'Technology',
  'Politics',
];

export const TAG_OPTIONS = tags.map((tag) => ({
  label: tag,
  value: tag,
}));

export const STATUS_OPTIONS = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
];
