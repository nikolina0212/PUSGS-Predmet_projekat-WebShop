import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "leaflet";
import { Button, Snackbar, Alert } from "@mui/material";
import Dashboard from "../shared/Dashboard";
import { GetOrdersOnMap, AcceptOrderOnMap } from "../../services/OrderService";

function Map() {
  const [markers, setMarkers] = useState([]);
  const [order, setOrder] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const geocodeAddresses = async () => {
      try{
        const orders = await GetOrdersOnMap();
        orders.forEach(async (order) => {
          try {
            const response = await axios.get(
              "https://maps.googleapis.com/maps/api/geocode/json",
              {
                params: {
                  address: order.shippingAddress,
                  key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                },
              }
            );
  
            const { results } = response.data;
            if (results.length > 0) {
              const { lat, lng } = results[0].geometry.location;
              setMarkers((prevMarkers) => [
                ...prevMarkers,
                { lat, lng, orderDetails: order },
              ]);
            }
          } catch (error) {
            console.log(error);
          }
        });
      }catch(error){
        console.log(error.message);
      }
    }
    
    geocodeAddresses();
  }, []);

  const customIcon = new Icon({
    iconUrl: process.env.PUBLIC_URL + "/location-icon.png",
    iconSize: [37, 37],
  });

  const handleMarkerClick = (orderDetails) => {
    setOrder(orderDetails);
  };

  const acceptOrder = async (orderId) => {
    try{
        const resp = await AcceptOrderOnMap(orderId);
        if(resp === 1){
          setSnackbarMessage("Successfully accepted order. Delivering started ...");
          setSnackbarOpen(true);
          setMarkers((prevMarkers) =>
            prevMarkers.filter((marker) => marker.orderDetails.id !== orderId)
            );
        }else{
          setSnackbarMessage("Successfully accepted order. Wait for other sellers to accept their order articles.");
          setSnackbarOpen(true);
          setMarkers((prevMarkers) =>
            prevMarkers.filter((marker) => marker.orderDetails.id !== orderId)
            );
        }
        
    }catch(error){
        console.log(error.message);
    }
  };


  return (
      <Dashboard content={
        <>

          <MapContainer center={[44.787197, 20.457273]} zoom={6}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker, index) => (
                    <Marker
                      icon={customIcon}
                      position={[marker.lat, marker.lng]}
                      key={index}
                      eventHandlers={{
                        click: () => handleMarkerClick(marker.orderDetails),
                      }}
                    >
                      <Popup>
                        <div style={{ width: '300px', padding: '16px', backgroundColor: '#343840', color: 'white' }}>
                            <p><b>{marker.orderDetails.shippingAddress}</b></p>
                            <p>Comment: {marker.orderDetails.comment}</p>
                          <p>Total price: {marker.orderDetails.totalPrice} usd</p>
                          <Button onClick={() => acceptOrder(order.id)} variant="outlined" color='success'>ACCEPT</Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
          </MapContainer>
          <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info">{snackbarMessage}</Alert>
      </Snackbar>
          </>}/>
            );
      }
export default Map;
