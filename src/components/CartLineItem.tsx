// Import necessary modules and types from the React library
import { ReactElement, ChangeEvent, memo } from "react";
import { CartItemType } from "../context/CartProvider";
import { ReducerAction } from "../context/CartProvider";
import { ReducerActionType } from "../context/CartProvider";

// Define the PropsType for the CartLineItem component
type PropsType = {
  item: CartItemType;
  dispatch: React.Dispatch<ReducerAction>;
  REDUCER_ACTIONS: ReducerActionType;
};

// Define the CartLineItem component
const CartLineItem = ({ item, dispatch, REDUCER_ACTIONS }: PropsType) => {
  // Construct the image URL for the item
  const img: string = new URL(`../img/${item.sku}.jpg`, import.meta.url).href;

  // Calculate the line total for the item
  const lineTotal: number = item.qty * item.price;

  // Determine the highest quantity for the select options
  const highestQty: number = 20 > item.qty ? 20 : item.qty;

  // Create an array of option values for the quantity select element
  const optionValues: number[] = [...Array(highestQty).keys()].map(
    (i) => i + 1
  );

  // Generate the select options for the quantity select element
  const options: ReactElement[] = optionValues.map((val) => {
    return (
      <option key={`opt${val}`} value={val}>
        {val}
      </option>
    );
  });

  // Define the onChangeQty function to handle quantity changes
  const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: REDUCER_ACTIONS.QUANTITY,
      payload: { ...item, qty: Number(e.target.value) },
    });
  };

  // Define the onRemoveFromCart function to handle item removal from the cart
  const onRemoveFromCart = () => {
    dispatch({ type: REDUCER_ACTIONS.REMOVE, payload: item });
  };

  // Define the content of the CartLineItem component
  const content = (
    <li className="cart__item">
      <img src={img} alt={item.name} className="cart__img" />
      <div aria-label="Item Name">{item.name}</div>
      <div aria-label="Price Per Item">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.price)}
      </div>

      <label htmlFor="itemQty" className="offscreen">
        Item Quantity
      </label>
      <select
        name="itemQty"
        id="itemQty"
        className="cart__select"
        value={item.qty}
        aria-label="Item Quantity"
        onChange={onChangeQty}
      >
        {options}
      </select>
      <div className="cart__item-subtotal" aria-label="Line Item Subtotal">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(lineTotal)}
      </div>
      <button
        className="cart__button"
        aria-label="Remove Item From Cart"
        title="Remove Item From Cart"
        onClick={onRemoveFromCart}
      >
        ❌
      </button>
    </li>
  );

  // Return the content of the CartLineItem component
  return content;
};

// Define the areItemsEqual function to compare two items for memoization
function areItemsEqual(
  { item: prevItem }: PropsType,
  { item: nextItem }: PropsType
) {
  return Object.keys(prevItem).every((key) => {
    return (
      prevItem[key as keyof CartItemType] ===
      nextItem[key as keyof CartItemType]
    );
  });
}

// Create a memoized version of the CartLineItem component to prevent unnecessary renders
const MemoizedCartLineItem = memo<typeof CartLineItem>(
  CartLineItem,
  areItemsEqual
);

// Export the CartLineItem component for use in other components
export default CartLineItem;
