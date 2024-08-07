import React, { useState } from 'react';
import api from '../services/api';
import Loading from './Loading';

interface Data {
  nrCpfCnpj: string;
  vlTotal: number;
  qtPrestacoes: number;
  vlPresta: number;
  vlMora: number;
  isValidCpfCnpj: boolean;
  isValidInstallment: boolean;
  isValidTotal: boolean;
  formattedTotal: string;
  formattedPresta: string;
  formattedMora: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const response = await api.post<Data[]>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
      setError(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {loading && <Loading />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results.length > 0 && !loading && (
        <div>
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>CPF/CNPJ</th>
                <th>Total</th>
                <th>Prestações</th>
                <th>Valor Prestação</th>
                <th>Valor Mora</th>
                <th>Valid CPF/CNPJ</th>
                <th>Valid Installment</th>
                <th>Valid Total</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.nrCpfCnpj}</td>
                  <td>{result.formattedTotal}</td>
                  <td>{result.qtPrestacoes}</td>
                  <td>{result.formattedPresta}</td>
                  <td>{result.formattedMora}</td>
                  <td>{result.isValidCpfCnpj ? 'Valid' : 'Invalid'}</td>
                  <td>{result.isValidInstallment ? 'Valid' : 'Invalid'}</td>
                  <td>{result.isValidTotal ? 'Valid' : 'Invalid'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
