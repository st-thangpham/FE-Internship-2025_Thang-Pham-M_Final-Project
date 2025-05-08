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
