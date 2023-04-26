// Import the necessary modules and components
import useCart from "../hooks/useCart";
import { useState } from "react";
import CartLineItem from "./CartLineItem";

// Define the Cart component
const Cart = () => {
  // Define the state for the confirmation message display
  const [confirm, setConfirm] = useState(false);

  // Destructure the necessary properties from the custom useCart hook
  const { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart } = useCart();

  // Define the onSubmitOrder function to submit the order and show the confirmation message
  const onSubmitOrder = () => {
    dispatch({ type: REDUCER_ACTIONS.SUBMIT });
    setConfirm(true);
  };

  // Define the pageContent based on whether the order has been submitted or not
  const pageContent = confirm ? (
    <h2>Thank you for your order!</h2>
  ) : (
    <>
      <h2 className="offscreen">Cart</h2>
      <ul className="cart">
        {cart.map((item) => {
          return (
            <CartLineItem
              key={item.sku}
              item={item}
              dispatch={dispatch}
              REDUCER_ACTIONS={REDUCER_ACTIONS}
            />
          );
        })}
      </ul>
      <div className="cart__totals">
        <p>Total Items: {totalItems}</p>
        <p>Total Price: {totalPrice}</p>
        <button
          className="cart__submit"
          disabled={!totalItems}
          onClick={onSubmitOrder}
        >
          Place Order
        </button>
      </div>
    </>
  );

  // Define the content of the Cart component
  const content = <main className="main main--cart">{pageContent}</main>;

  // Return the content of the Cart component
  return content;
};

// Export the Cart component for use in other components
export default Cart;
