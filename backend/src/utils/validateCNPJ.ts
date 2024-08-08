export const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  const cleanedCNPJ = cnpj.replace(/[^\d]/g, '');

  // Verifica se o CNPJ tem 14 dígitos
  if (cleanedCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1*$/.test(cleanedCNPJ)) return false;

  // Pesos para o cálculo dos dígitos verificadores
  const weightsFirstDigit = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weightsSecondDigit = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calculateVerifierDigit = (base: number[], weights: number[]): number => {
    const sum = base.reduce((acc, digit, idx) => acc + digit * weights[idx], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digits = cleanedCNPJ.split('').map(Number);

  // Calcula o primeiro dígito verificador
  const firstVerifierDigit = calculateVerifierDigit(digits.slice(0, 12), weightsFirstDigit);
  if (digits[12] !== firstVerifierDigit) return false;

  // Calcula o segundo dígito verificador
  const secondVerifierDigit = calculateVerifierDigit(digits.slice(0, 13), weightsSecondDigit);
  if (digits[13] !== secondVerifierDigit) return false;

  return true;
};
