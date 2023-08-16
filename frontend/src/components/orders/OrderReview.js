import React from "react";
import { Box, Paper, TableBody, IconButton, Table, TableContainer, TableHead, TableRow, TableCell } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function OrderReview({order, onDeleteArticle}){

  const handleDeleteArticle = async (rowKey) => {
    try {
      onDeleteArticle(rowKey);
    } catch (error) {
      console.log(error.message);
    }
  }
  

  return (<>
  {order === null && <h3>Loading...</h3>}
  {order && (

<Box maxWidth={600} margin="auto">
<Box
  component={Paper}
  marginTop={2}
  padding={2}
>
  <TableContainer>
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell><b>Name</b></TableCell>
          <TableCell></TableCell>
          <TableCell align="right"><b>Amount</b></TableCell>
          <TableCell align="right"><b>Price</b></TableCell>
          <TableCell align="right"><b>Fee</b></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {order.map((orderArticle) => {
          const rowKey = `${orderArticle.orderId}-${orderArticle.articleId}`;
          return (
            <TableRow key={rowKey}>
              <TableCell>
              <img
                className="item-image"
                alt=""
                src={`https://localhost:44320/${orderArticle.articleImage}`}
                style={{ width: '50px', height: '50px' }}
              />
                </TableCell>
              <TableCell>{orderArticle.articleName}</TableCell>
              <TableCell align="right">
                {orderArticle.articleQuantity}
              </TableCell>
              <TableCell align="right">
                {orderArticle.articlePrice} usd
              </TableCell>
              <TableCell align="right">
              {orderArticle.fee} usd
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="#a6ad93"
                  size="small"
                  onClick={() => handleDeleteArticle(rowKey)}
                >
                  <DeleteIcon/>
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell colSpan={2.5} align="right">
            <b>Price:</b>
          </TableCell>
          <TableCell align="right">{order[0].totalPrice - order[0].totalFee} usd</TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2.5} align="right">
            <b>Total delivery fee:</b>
          </TableCell>
          <TableCell align="right">{order[0].totalFee} usd</TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2.5} align="right">
            <b>Total price:</b>
          </TableCell>
          <TableCell align="right">{order[0].totalPrice} usd</TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
        
      </TableBody>
    </Table>
  </TableContainer>
</Box>
</Box>
  )}
  </>);
}

export default OrderReview;
