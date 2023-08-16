import React from "react";
import OrderReview from "./OrderReview";
import Dashboard from "../shared/Dashboard";
import { CssBaseline, Typography, Container, Paper, Stepper, Step, StepLabel,
Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { GetOrderArticles, DeleteOrderArticle } from "../../services/OrderService";

function Order(){
  const steps = ['Order review', 'Shipping address and comment', 'Payment details'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeleteArticle = async (rowKey) => {
    try {
      const [orderId, articleId] = rowKey.split('-');
      await DeleteOrderArticle(articleId, orderId);
      getCurrentOrder();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <OrderReview order={currentOrder} onDeleteArticle={handleDeleteArticle}/>;
      case 1:
        return <h3>Payment form</h3>;
      case 2:
        return <h3>Address form</h3>;
      default:
        throw new Error('Unknown step');
    }
  }

  const getCurrentOrder = async () => {
    try {
      const resp = await GetOrderArticles();
      setCurrentOrder(resp);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getCurrentOrder();
  }, []);
  return (
    <Dashboard content={
      <>
      {currentOrder === null && !errorMessage && (<h3>Loading...</h3>)}
      {errorMessage && (<h3>{errorMessage}</h3>)}
      {currentOrder !== null && errorMessage === '' && (

<React.Fragment>
<CssBaseline />
<Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
  <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
    {activeStep === steps.length ? (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Thank you for your order.
        </Typography>
      </React.Fragment>
    ) : (
      <React.Fragment>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
              Back
            </Button>
          )}

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ mt: 3, ml: 1 }}
          >
            {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
          </Button>
        </Box>
      </React.Fragment>
    )}
  </Paper>
</Container>
</React.Fragment>
      )}
      </>
    }/>
  );
}

export default Order;