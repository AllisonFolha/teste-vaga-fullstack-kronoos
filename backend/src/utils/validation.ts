// Validação de CPF
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
  
  // Validação de CNPJ
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
  