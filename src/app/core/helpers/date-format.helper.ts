export const isValidDDMMYYYY = (dateStr: string): boolean => {
  const [dd, mm, yyyy] = dateStr.split('/').map(Number);
  const date = new Date(`${yyyy}-${mm}-${dd}`);
  return (
    !isNaN(date.getTime()) &&
    date.getDate() === dd &&
    date.getMonth() + 1 === mm &&
    date.getFullYear() === yyyy
  );
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  if (date.getFullYear() === now.getFullYear()) {
    return `${day}/${month}`;
  }

  return `${day}/${month}/${date.getFullYear()}`;
};
