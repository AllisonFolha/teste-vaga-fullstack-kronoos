import React, { useState } from 'react';
import api from '../../services/api';
import Loading from '../loading/Loading';
import Pagination from '../pagination/Pagination';
import Table from '../table/Table';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import Button from '../button/Button';
import './FileUpload.scss';

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
  const [page, setPage] = useState<number>(1);

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
    setPage(1);

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

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const itemsPerPage = 100;
  const displayedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(results.length / itemsPerPage);

  return (
    <div className="file-upload-container">
      <Header />
      <h1>Upload CSV File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button onClick={handleSubmit} label="Upload" />
      </form>
      {loading && <Loading />}
      {error && <p className="error">{error}</p>}
      {results.length > 0 && !loading && (
        <div>
          <h2>Results</h2>
          <Table
            columns={[
              'CPF/CNPJ',
              'Total',
              'Prestações',
              'Valor Prestação',
              'Valor Mora',
              'Valid CPF/CNPJ',
              'Valid Installment',
              'Valid Total',
            ]}
            data={displayedResults.map((result) => ({
              'CPF/CNPJ': result.nrCpfCnpj,
              Total: result.formattedTotal,
              Prestações: result.qtPrestacoes,
              'Valor Prestação': result.formattedPresta,
              'Valor Mora': result.formattedMora,
              'Valid CPF/CNPJ': result.isValidCpfCnpj ? 'Valid' : 'Invalid',
              'Valid Installment': result.isValidInstallment ? 'Valid' : 'Invalid',
              'Valid Total': result.isValidTotal ? 'Valid' : 'Invalid',
            }))}
          />
          <Pagination pageCount={pageCount} page={page} onChange={handleChangePage} />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FileUpload;
