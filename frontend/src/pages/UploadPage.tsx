import React, { useState } from 'react';
import FileUpload from '../components/fileUpload/FileUpload';
import Modal from '../components/modal/Modal';
import Notification from '../components/notification/Notification';
import Loading from '../components/loading/Loading';
import Table from '../components/table/Table';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import api from '../services/api';
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

  return (
    <div className="upload-page-container">
      <Header />
      <FileUpload onFileUpload={handleFileUpload} />
      {loading && <Loading />}
      {notification && <Notification message={notification.message} type={notification.type} />}
      <Modal show={showModal} onClose={handleCloseModal}>
        <h2>Processamento Concluído</h2>
        <p>Seu arquivo foi processado com sucesso.</p>
      </Modal>
      {results.length > 0 && !loading && (
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
            data={results.map((result) => ({
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
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UploadPage;
