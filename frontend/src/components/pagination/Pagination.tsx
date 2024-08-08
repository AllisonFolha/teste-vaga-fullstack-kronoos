import React from 'react';
import { Pagination as MuiPagination, PaginationProps as MuiPaginationProps } from '@mui/material';
import Box from '@mui/material/Box';
import './Pagination.scss';

interface PaginationProps extends MuiPaginationProps {
  pageCount: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, page, onChange, ...props }) => (
    <Box className="pagination-container">
      <MuiPagination count={pageCount} page={page} onChange={onChange} {...props} />
    </Box>
  );

export default Pagination;
