export const validateCPF = (cpf: string): boolean => {
  if (cpf.length !== 11 || /^(\d)\1*$/.test(cpf)) return false;

  const digits = cpf.split('').map(Number);
  for (let j = 9; j < 11; j++) {
    let sum = 0;
    for (let i = 0; i < j; i++) {
      sum += digits[i] * ((j + 1) - i);
    }
    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== digits[j]) return false;
  }
  return true;
};
