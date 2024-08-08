import { validateCPF } from '../utils/validateCPF';
import { validateCNPJ } from '../utils/validateCNPJ';

describe('Validação de CPF', () => {
  test('verifica CPF válido', () => {
    expect(validateCPF('17841961006')).toBe(true); 
  });

  test('verifica CPF inválido', () => {
    expect(validateCPF('12345678900')).toBe(false); 
  });

  test('verifica CPF com todos os dígitos iguais', () => {
    expect(validateCPF('11111111111')).toBe(false);
  });

  test('verifica CPF com comprimento incorreto', () => {
    expect(validateCPF('12345678')).toBe(false);
    expect(validateCPF('1234567890900')).toBe(false);
  });

});

describe('Validação de CNPJ', () => {
  test('valida CNPJ válido', () => {
    expect(validateCNPJ('78177816000182')).toBe(true); 
  });

  test('verifica CNPJ inválido', () => {
    expect(validateCNPJ('12345678000100')).toBe(false); 
  });

  test('verifica CNPJ com todos os dígitos iguais', () => {
    expect(validateCNPJ('11111111111111')).toBe(false);
  });

  test('verifica CNPJ com comprimento incorreto', () => {
    expect(validateCNPJ('12345678')).toBe(false);
    expect(validateCNPJ('1234567800019500')).toBe(false);
  });

});
