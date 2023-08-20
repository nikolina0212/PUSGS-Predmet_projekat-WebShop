import React from "react";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TableHead, Alert } from '@mui/material';
import { useState, useEffect } from "react";
import Details from "./Details";
import Dashboard from "../shared/Dashboard";
import { OrderDetails } from "../../models/orders/OrderDetails";
import { GetSellerOrders, GetSellerOrderDetails } from "../../services/OrderService";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function Delivered(){
  const [orders, setOrders] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [orderArticles, setOrderArticles] = useState(new OrderDetails());

  const getDeliveredOrders = async () => {
    try {
      const resp = await GetSellerOrders(false);
      setOrders(resp);
    } catch (error) {
      setErrorMessage(error.message);
    }
  
};

  useEffect(() => {
    getDeliveredOrders();
  }, []);
  
  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dateFormatting = (date) => {
    return new Date(date).toLocaleString();
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = async (orderId) => {
    try {
      const resp = await GetSellerOrderDetails(orderId);
      setOrderArticles(resp);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setOpenDialog(true);
  };

  return ( <Dashboard content={
    <>
    
    {orders === null && !errorMessage && (<h1>Loading...</h1>)}
    {errorMessage && (<Alert severity="error" style={{width: '400px'}}>{errorMessage}</Alert>)}
    {orders && (
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align='right'><b>Order placement time</b></TableCell>
            <TableCell align='right'><b>Delivery time</b></TableCell>
            <TableCell align='right'><b>Comment</b></TableCell>
            <TableCell align='right'><b>Shipping address</b></TableCell>
            <TableCell align='right'><b>Price (USD)</b></TableCell>
          </TableRow>
          </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : orders
          ).map((order) => (
            <TableRow key={order.id}>
              <TableCell  align="right" style={{width: '200px'}}>
                {dateFormatting(order.orderPlacementTime)}
              </TableCell>
              <TableCell  align="right" style={{width: '200px'}}>
                {dateFormatting(order.estimatedDeliveryDate)}
              </TableCell>
              <TableCell  align="right">
                {order.comment}
              </TableCell>
              <TableCell  align="right">
                {order.shippingAddress}
              </TableCell>
              <TableCell  align="right">
                {order.totalPrice}
              </TableCell>
              <TableCell align="right">
              <div>
                      <IconButton onClick={() => handleOpenDialog(order.id)}>
                        <FormatListBulletedIcon/>
                      </IconButton>
                  </div>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={8} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    )}
    <Details
      open={openDialog}
      handleClose={handleCloseDialog}
      orderArticles={orderArticles}
    />
    </>
  }/>
);

}

export default Delivered;