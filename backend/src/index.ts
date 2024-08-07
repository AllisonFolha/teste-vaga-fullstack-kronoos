import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors'; // Importar a biblioteca cors
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { formatCurrency } from './utils/formatCurrency';
import { validateCPF, validateCNPJ } from './utils/validation';
import { validateTotalInstallments } from './utils/validateTotalInstallments';

const app = express();
const port = 3000;

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

// Middleware para lidar com uploads de arquivos
app.use(fileUpload({
  createParentPath: true,
}));

// Middleware para permitir CORS
app.use(cors({
  origin: 'http://localhost:8081', // Permitir requisições do front-end rodando em http://localhost:8081
}));

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    console.error('No files were uploaded.');
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file as fileUpload.UploadedFile;
  const uploadPath = path.join(__dirname, 'uploads', file.name);

  // Mover o arquivo para a pasta de uploads
  file.mv(uploadPath, (err) => {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).send(err);
    }

    const results: Data[] = [];

    fs.createReadStream(uploadPath)
      .pipe(csv())
      .on('data', (data) => {
        const item: Data = {
          nrCpfCnpj: data.nrCpfCnpj,
          vlTotal: parseFloat(data.vlTotal),
          qtPrestacoes: parseInt(data.qtPrestacoes, 10),
          vlPresta: parseFloat(data.vlPresta),
          vlMora: parseFloat(data.vlMora),
          isValidCpfCnpj: false,
          isValidInstallment: false,
          isValidTotal: false,
          formattedTotal: '',
          formattedPresta: '',
          formattedMora: ''
        };

        item.isValidCpfCnpj = item.nrCpfCnpj.length === 11
          ? validateCPF(item.nrCpfCnpj)
          : validateCNPJ(item.nrCpfCnpj);

        const { isValidInstallment, isValidTotal } = validateTotalInstallments(item.vlTotal, item.qtPrestacoes, item.vlPresta);
        item.isValidInstallment = isValidInstallment;
        item.isValidTotal = isValidTotal;

        item.formattedTotal = formatCurrency(item.vlTotal);
        item.formattedPresta = formatCurrency(item.vlPresta);
        item.formattedMora = formatCurrency(item.vlMora);

        results.push(item);
      })
      .on('end', () => {
        res.json(results);
      })
      .on('error', (err) => {
        console.error('Error reading CSV:', err);
        res.status(500).send('Error processing CSV file.');
      });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
