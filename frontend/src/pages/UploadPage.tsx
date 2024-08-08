import React, { useState } from 'react';
import FileUpload from '../components/fileUpload/FileUpload';
import Modal from '../components/modal/Modal';
import Notification from '../components/notification/Notification';
import Loading from '../components/loading/Loading';
import Table from '../components/table/Table';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Pagination from '../components/pagination/Pagination';
import api from '../services/api';
import { maskCPF, maskCNPJ } from '../utils/mask';
import './UploadPage.scss';

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

const UploadPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Data[]>([]);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('all');
  const itemsPerPage = 10;

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setResults([]);
    setNotification(null);

    try {
      const response = await api.post<Data[]>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
      setNotification({ message: 'Arquivo carregado e processado com sucesso!', type: 'success' });
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao carregar o arquivo:', error);
      setNotification({ message: 'Erro ao carregar o arquivo', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
    setPage(1); // Reset page to 1 when filter changes
  };

  const filteredResults = results.filter(result => {
    if (filter === 'cpf') return result.nrCpfCnpj.length === 11 && result.isValidCpfCnpj;
    if (filter === 'cnpj') return result.nrCpfCnpj.length === 14 && result.isValidCpfCnpj;
    if (filter === 'invalid') return !result.isValidCpfCnpj;
    return true; // 'all'
  });

  const paginatedResults = filteredResults.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <Header />
      <div className="upload-page-container">
        <FileUpload onFileUpload={handleFileUpload} />
        {loading && <Loading />}
        {notification && <Notification message={notification.message} type={notification.type} />}
        <Modal show={showModal} onClose={handleCloseModal}>
          <div className="modal-header">Processamento Concluído</div>
          <div className="modal-body">
            <p>Seu arquivo foi processado com sucesso.</p>
          </div>
          <div className="modal-footer">
            <button onClick={handleCloseModal}>Fechar</button>
          </div>
        </Modal>
        {results.length > 0 && !loading && (
          <>
            <div className="filter-container">
              <label htmlFor="filter">Filtrar por:</label>
              <select id="filter" value={filter} onChange={handleFilterChange}>
                <option value="all">Todos</option>
                <option value="cpf">CPFs Válidos</option>
                <option value="cnpj">CNPJs Válidos</option>
                <option value="invalid">Inválidos</option>
              </select>
            </div>
            <div className="results-container">
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
                data={paginatedResults.map((result) => ({
                  'CPF/CNPJ': result.nrCpfCnpj.length === 11 ? maskCPF(result.nrCpfCnpj) : maskCNPJ(result.nrCpfCnpj),
                  Total: result.formattedTotal,
                  Prestações: result.qtPrestacoes,
                  'Valor Prestação': result.formattedPresta,
                  'Valor Mora': result.formattedMora,
                  'Valid CPF/CNPJ': result.isValidCpfCnpj ? 'Valid' : 'Invalid',
                  'Valid Installment': result.isValidInstallment ? 'Valid' : 'Invalid',
                  'Valid Total': result.isValidTotal ? 'Valid' : 'Invalid',
                }))}
              />
              <Pagination
                pageCount={Math.ceil(filteredResults.length / itemsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UploadPage;
