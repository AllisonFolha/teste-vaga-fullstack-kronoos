export const validateTotalInstallments = (vlTotal: number, qtPrestacoes: number, vlPresta: number) => {
    const calculatedInstallment = vlTotal / qtPrestacoes;
    const isValidInstallment = calculatedInstallment === vlPresta;
  
    const totalFromInstallments = vlPresta * qtPrestacoes;
    const isValidTotal = totalFromInstallments === vlTotal;
  
    return { isValidInstallment, isValidTotal };
  };
  