import React, { useRef, useEffect } from "react";

export default function PayPalButton({ totalPrice, disabled, onSuccess  }) {
  const paypal = useRef();

  useEffect(() => {
    /* eslint-disable */
    const renderPayPalButton = async () => {
      await window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: totalPrice,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            if (onSuccess) {
              onSuccess();
            }
          },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(paypal.current);
    };

    renderPayPalButton();
    return () => {
      if (paypal.current) {
        paypal.current.innerHTML = "";
      }
    };
  }, [totalPrice]);
/* eslint-enable */

  return (
    <>
      <div ref={paypal} style={{ pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.5 : 1 }}></div>
    </>
  );
}
