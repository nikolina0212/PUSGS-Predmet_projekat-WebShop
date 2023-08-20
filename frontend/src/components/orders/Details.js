import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import { OrderDetails } from "../../models/orders/OrderDetails";

function Details({open, handleClose, orderArticles}){
  return(
    <Dialog open={open} onClose={handleClose} PaperProps={{ elevation: 10, sx: { width: '500px' } }}>
    <DialogTitle>ORDER DETAILS</DialogTitle>
    <DialogContent>
      {orderArticles && orderArticles.length > 0 ? (
        <List>
          {orderArticles.map((article, index) => (
            <React.Fragment key={article.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                    <span>
                    <img
                          className="item-image"
                          alt=""
                          src={`https://localhost:44320/${article.image}`}
                          style={{ width: '50px', height: '50px' }}
                        />
                    </span>
                    <br />
                    <span>Name: {article.name}</span>
                    </>
                  }
                  secondary={
                    <>
                      <span>Description: {article.description}</span>
                      <br />
                      <span>Price: {article.price} USD</span>
                      <br />
                      <span>Amount: {article.amountOfArticle}</span>
                      <br />
                      {article.sellerName && (
                        <span>Seller name: {article.sellerName}</span>
                      )}
                    </>
                  }
                />
              </ListItem>
              {index !== OrderDetails.length - 1 && <Divider sx={{ height: 2, backgroundColor: 'black', margin: '10px 0' }}/>}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <p>No articles.</p>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
  );
}

export default Details;