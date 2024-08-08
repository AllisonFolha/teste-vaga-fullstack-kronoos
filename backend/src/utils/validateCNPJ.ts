export const validateCNPJ = (cnpj: string): boolean => {
  if (cnpj.length !== 14 || /^(\d)\1*$/.test(cnpj)) return false;

  const digits = cnpj.split('').map(Number);
  const validationArray = [6, 7, 8, 9, 2, 3, 4, 5];

  for (let j = 12; j < 14; j++) {
    let sum = 0;
    for (let i = 0; i < j; i++) {
      sum += digits[i] * validationArray[(j - i) % 8];
    }
    const rest = sum % 11;
    if (rest < 2) {
      if (digits[j] !== 0) return false;
    } else {
      if (digits[j] !== (11 - rest)) return false;
    }
  }
  return true;
};
