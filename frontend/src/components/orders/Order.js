import React from "react";
import OrderReview from "./OrderReview";
import Dashboard from "../shared/Dashboard";
import { CssBaseline, Typography, Container, Paper, Stepper, Step, StepLabel,
Box, Button, TextField, Grid, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { GetOrderArticles, DeleteOrderArticle, PlaceOrder } from "../../services/OrderService";
import { OrderConfirmation } from "../../models/orders/OrderConfirmation";
import PayPalButton from "./PayPal";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';

function Order(){
  const steps = ['Order review', 'Shipping address and comment', 'Payment details'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [orderConfirmation, setOrderConfirmation] = useState(new OrderConfirmation());
  const [currentOrder, setCurrentOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');

  const [cityValid, setCityValid] = useState(false); 
  const [addressValid, setAddressValid] = useState(false); 
  const [zipValid, setZipValid] = useState(false);
  const [countryValid, setCountryValid] = useState(false); 




  const handleDeleteArticle = async (rowKey) => {
    try {
      const [orderId, articleId] = rowKey.split('-');
      await DeleteOrderArticle(articleId, orderId);
      getCurrentOrder();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const handleNext = async () => {
    setActiveStep(activeStep + 1);
    if (activeStep === steps.length - 1){
      try {
        console.log(orderConfirmation);
        const resp = await PlaceOrder(currentOrder[0].orderId, orderConfirmation);
        setMessage(resp);
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case 'city':
        setCity(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'zip':
        setZip(value);
        break;
      case 'country':
        setCountry(value);
        break;
      default:
        break;
    }

    switch (field) {
      case 'city':
        setCityValid(value.trim() !== ''); 
        break;
      case 'address':
        setAddressValid(value.trim() !== ''); 
        break;
      case 'zip':
        setZipValid(value.trim() !== '');
        break;
      case 'country':
        setCountryValid(value.trim() !== ''); 
        break;
      default:
        break;
    }
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <OrderReview order={currentOrder} onDeleteArticle={handleDeleteArticle}/>;
      case 1:
        return (
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  autoComplete='off'
                  value={city}
                  variant="standard"
                  onChange={(e) => {
                  handleInputChange('city', e.target.value);
                  setOrderConfirmation((prevData) => ({
                    ...prevData,
                    shippingAddress: `${address}, ${e.target.value}, ${zip}, ${country}`
                  }));
                  }}
                  helperText={!cityValid && 'Please fill out city.'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="address"
                  autoComplete='off'
                  name="address"
                  label="Address"
                  fullWidth
                  value={address}
                  variant="standard"
                  onChange={(e) => {
                    handleInputChange('address', e.target.value);
                    setOrderConfirmation((prevData) => ({
                      ...prevData,
                      shippingAddress: `${e.target.value}, ${city}, ${zip}, ${country}`
                    }));
                    }}
                  helperText={!addressValid && 'Please fill out address.'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="zip"
                  name="zip"
                  autoComplete='off'
                  label="Zip / Postal code"
                  fullWidth
                  value={zip}
                  onChange={(e) => {
                    handleInputChange('zip', e.target.value);
                    setOrderConfirmation((prevData) => ({
                      ...prevData,
                      shippingAddress: `${address}, ${city}, ${e.target.value}, ${country}`
                    }));
                    }}
                  helperText={!zipValid && 'Please fill out zip code.'}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="country"
                  autoComplete='off'
                  name="country"
                  label="Country"
                  value={country}
                  onChange={(e) => {
                    handleInputChange('country', e.target.value);
                    setOrderConfirmation((prevData) => ({
                      ...prevData,
                      shippingAddress: `${address}, ${city}, ${zip}, ${e.target.value}`
                    }));
                    }}
                  helperText={!countryValid && 'Please fill out country.'}
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  autoComplete='off'
                  id="comment"
                  value={orderConfirmation.comment}
                  name="comment"
                  label="Comment"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setOrderConfirmation((prevData) => ({
                    ...prevData,
                    comment: `${e.target.value}`
                  }))}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        );
      case 2:
        return  <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
          <Box display="flex" alignItems="center" mb={1}>
        <Checkbox checked={isCheckboxChecked} onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
        icon={<AttachMoneyIcon/>} checkedIcon={<PaidIcon/>} disabled={isSuccess}/>
        <Typography>Pay with cash</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body2">or proceed with</Typography>
          <Box marginTop={1}>
            <PayPalButton totalPrice={currentOrder[0].totalPrice} disabled={isCheckboxChecked}
            onSuccess={() => setIsSuccess(true)} />
          </Box>
        </Box>
      </Box>;
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
          {message}
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
            disabled={
              (activeStep === 1 && (!cityValid || !addressValid || !zipValid || !countryValid)) ||
              (activeStep === steps.length - 1 && (!isSuccess && !isCheckboxChecked))
            }
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