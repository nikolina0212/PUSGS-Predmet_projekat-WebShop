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
import { TableHead, Alert, Button , Snackbar} from '@mui/material';
import { useState, useEffect } from "react";
import Details from "./Details";
import Dashboard from "../shared/Dashboard";
import { OrderDetails } from "../../models/orders/OrderDetails";
import { GetOrderDetails, GetDeliveredOrders, CancelOrder } from "../../services/OrderService";

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

function History(){
  const [orders, setOrders] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const [counter, setCounter] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [orderArticles, setOrderArticles] = useState(new OrderDetails());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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


  const getDeliveredOrders = async () => {
    try {
      const resp = await GetDeliveredOrders();
      setOrders(resp);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getDeliveredOrders();
  }, []);

  const getStatus = (status) => {
    if( status === 2){
      return 'DELIVERING';
    }
    if(status === 3){
      return 'DELIVERED';
    }
  };

  const handleOpenDialog = async (orderId) => {
    try {
      const resp = await GetOrderDetails(orderId);
      setOrderArticles(resp);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setOpenDialog(true);
  };

  const calculateRemainingTime = (deliveryTime) => {
    const currentTime = new Date();
    const targetTime = new Date(deliveryTime);
    const timeDifference = targetTime.getTime() - currentTime.getTime();
  
    if (timeDifference > 0) {
      const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const remainingHours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const remainingMinutes = Math.floor((timeDifference / 1000 / 60) % 60);
      const remainingSeconds = Math.floor((timeDifference / 1000) % 60);
      return `${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
    } else {
      return "Delivered!";
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const resp = await CancelOrder(orderId);
      const filtered = orders.filter((order) => order.id !== +orderId);
      setOrders(filtered);
      setSnackbarMessage(resp);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const updateCounter = () => {
      if (orders) {
        const updatedTimes = {};
        orders.forEach((order) => {
          if (order.orderStatus === 2) {
            const remainingTime = calculateRemainingTime(order.estimatedDeliveryDate);
            updatedTimes[order.id] = remainingTime;
          }
        });
        setCounter(updatedTimes);
      }
    };

    updateCounter();

    const timer = setInterval(() => {
      updateCounter();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [orders]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
            <TableCell align='right'><b>Order status</b></TableCell>
            <TableCell align='right'><b>Remaining time</b></TableCell>
            <TableCell></TableCell>
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
              <TableCell  align="right">
                {getStatus(order.orderStatus)}
              </TableCell>
              <TableCell align="right">
                {order.orderStatus === 3 && (<p>/</p>)}
                {order.orderStatus === 2 && (<div>
                      {counter[order.id] && <span>{counter[order.id]}</span>}
                      </div>)}
              </TableCell>
              <TableCell align="right">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleOpenDialog(order.id)}>
                    <FormatListBulletedIcon />
                  </IconButton>
                  {order.orderStatus === 2 && (
                    <Button variant="outlined" color="error" size="small" onClick={() => handleCancel(order.id)}>
                    Cancel
                    </Button>
                  )}
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
     <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info">{snackbarMessage}</Alert>
      </Snackbar>
    </>
  }/>
);
}

export default History;