import React from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// import { stripePK } from '../../../config/constant';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(stripePK);


export const StripePayment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const confirmSetup = async ()=> {
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
          }
      
          const {error} = await stripe.confirmSetup({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/dashboard/billing",
            }
          });
      
          if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            // setErrorMessage(error.message);
          } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            // http://localhost:3000/dashboard/billing?setup_intent=seti_1LkkIBSHJXzrue2JFURTYJCh&setup_intent_client_secret=seti_1LkkIBSHJXzrue2JFURTYJCh_secret_MThhgZ5O3SI65Xy28iZNApf3u2dX7sM&redirect_status=succeeded
            console.log('setup succes ');
            
          }
    };

    const confirmPayment = async () => {
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/dashboard/billing",
            },
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            console.log('result success ', result);

            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            // http://localhost:3000/dashboard/billing?payment_intent=pi_3Lk2yrSHJXzrue2J0FcTKzbq&payment_intent_client_secret=pi_3Lk2yrSHJXzrue2J0FcTKzbq_secret_9pqtPAd7rP2c3TB0ubAEKziLA&redirect_status=succeeded
        }

    }
    return (
        <div className='bg-white p-4 rounded'>
            <PaymentElement />
            {/* <button onClick={confirmPayment}>Confirm payment</button> */}
            <button onClick={confirmSetup}>Confirm payment details</button>

        </div>
    )
}
