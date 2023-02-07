import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CustomizeTable = props => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>        
            {props.headCells.map((headCell, index) => (
                <StyledTableCell key={index} align="center">{headCell.label}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => (
            <StyledTableRow key={index}>
              {row.tableName == 'todaySalesTable' &&
                <>
                    <StyledTableCell align="center">
                        <Typography fontSize={'36px'} >{row.totalSales}円</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'36px'} >{row.totalCustomerNumber}人</Typography>
                    </StyledTableCell>
                </>
              }
              {row.tableName == 'weekSalesTable' &&
                <>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalSales_0}円</Typography>
                        <Typography fontSize={'20px'} >{row.totalCustomerNumber_0}人</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalSales_1}円</Typography>
                        <Typography fontSize={'20px'} >{row.totalCustomerNumber_1}人</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalSales_2}円</Typography>
                        <Typography fontSize={'20px'} >{row.totalCustomerNumber_2}人</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalSales_3}円</Typography>
                        <Typography fontSize={'20px'} >{row.totalCustomerNumber_3}人</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalSales_4}円</Typography>
                        <Typography fontSize={'20px'} >{row.totalCustomerNumber_4}人</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalSales_5}円</Typography>
                        <Typography fontSize={'20px'} >{row.totalCustomerNumber_5}人</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalSales_6}円</Typography>
                        <Typography fontSize={'20px'} >{row.totalCustomerNumber_6}人</Typography>
                    </StyledTableCell>
                </>
              }
              {row.tableName == 'SalesMgrByDayTable' &&
                <>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.salesDate}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalSales}円</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalCustomerNumber}人</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.feePerCustomer}円</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.totalNominationFee}円</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography fontSize={'20px'} >{row.nominationNumber}人</Typography>
                    </StyledTableCell>
                </>
              }
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomizeTable;