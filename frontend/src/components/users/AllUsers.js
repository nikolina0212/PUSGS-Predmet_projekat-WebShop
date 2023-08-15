import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import Tooltip from '@mui/material/Tooltip';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Dashboard from '../shared/Dashboard';
import { useEffect, useState } from 'react';
import { GetAllUsers, AcceptUser, RejectUser } from '../../services/UserService';
import { TableHead } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import UnpublishedIcon from '@mui/icons-material/Unpublished';

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

export default function AllUsers() {
  const [users, setUsers] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getAll = async () => {
    try {
      const resp = await GetAllUsers();
      setUsers(resp);
      console.log(users);
    } catch (error) {
      console.log(error.message);
    }
    };
    useEffect(() => {
        getAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getType = (type) => {
    if( type === 1){
      return 'Purchaser';
    }else{
      return 'Seller';
    }
 }

 const getStatus = (status) => {
  if( status === 0){
    return 'Pending';
  }else{
    return 'Finished';
  }
}

const handleAccept = async (id) => {
  try{
      await AcceptUser(id);
      const accepted = users.map((user) =>
      user.id === id ? { ...user, verified: true, verificationStatus: 1 } : user);
      setUsers(accepted);
  }catch (error) {
      console.log(error.message);
  } 
}

const handleReject = async (id) => {
  try{
    await RejectUser(id);
    const updated = users.map((user) =>
      user.id === id ? { ...user, verified: false, verificationStatus: 1 } : user);
    setUsers(updated);
  }catch (error) {
    console.log(error.message);
  } 
}

  return (
    <Dashboard content={
      <>
      
      {users === null && (<h1>No users yet.</h1>)}
      {users && (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
            <TableCell></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell align='right'><b>Username</b></TableCell>
              <TableCell align='right'><b>Firstname</b></TableCell>
              <TableCell align='right'><b>Lastname</b></TableCell>
              <TableCell align='right'><b>User type</b></TableCell>
              <TableCell align='right'><b>Verification status</b></TableCell>
              <TableCell align='right'><b>Verified</b></TableCell>
            </TableRow>
            </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : users
            ).map((user) => (
              <TableRow key={user.id}>
                <TableCell align="right">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          alt=""
                          src={`https://localhost:44320/${user.image}`}
                          style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                      </div>
                    </TableCell>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell>
                <TableCell  align="right">
                  {user.username}
                </TableCell>
                <TableCell  align="right">
                  {user.firstName}
                </TableCell>
                <TableCell  align="right">
                  {user.lastName}
                </TableCell>
                <TableCell  align="right">
                  {getType(user.userType)}
                </TableCell>
                <TableCell  align="right">
                  {getStatus(user.verificationStatus)}
                </TableCell>
                <TableCell align='right'>
                {user.verified ? "Verified" : "Unverified"}
                </TableCell>
                {!user.verified && user.verificationStatus === 0 && (
                  <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title='Accept'>
                      <IconButton onClick={() => handleAccept(user.id)}>
                        <CheckRoundedIcon style={{ color: 'green' }}/>
                    </IconButton>
                    </Tooltip>
                    <Tooltip title='Reject'>
                    <IconButton onClick={() => handleReject(user.id)}>
                        <CloseRoundedIcon style={{ color: 'red' }}/>
                    </IconButton>
                    </Tooltip>
                      </div>
                  </TableCell>
                    )}
                    {user.verified && user.verificationStatus === 1 && (
                  <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                      <VerifiedIcon style={{ color: 'green' }}/>
                      </div>
                  </TableCell>
                    )}
                     {!user.verified && user.verificationStatus === 1 && (
                  <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                      <UnpublishedIcon style={{ color: 'red' }}/>
                      </div>
                  </TableCell>
                    )}
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
                count={users.length}
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
      </>
    }/>
  );
}