// Import required functions and types from the React library.
import { useReducer, createContext, useMemo, ReactElement } from "react";

// Define a type for the items that can be added to the cart.
export type CartItemType = {
  sku: string;
  name: string;
  price: number;
  qty: number;
};

// Define a type for the state of the cart.
type CartStateType = {
  cart: CartItemType[];
};

// Define an initial state for the cart.
const initCartState: CartStateType = {
  cart: [],
};

// Define action types that can be dispatched to the reducer.
const REDUCER_ACTION_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  QUANTITY: "QUANTITY",
  SUBMIT: "SUBMIT",
};

// Define a type for the action types.
export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

// Define a type for the actions that can be dispatched to the reducer.
export type ReducerAction = {
  type: string;
  payload?: CartItemType;
};

// Define the reducer function that will update the state based on the dispatched action.
const reducer = (
  state: CartStateType,
  action: ReducerAction
): CartStateType => {
  switch (action.type) {
    // Add an item to the cart.
    case REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload) {
        throw new Error("action.payload is required");
      }
      const { sku, name, price } = action.payload;
      // Remove any existing items with the same SKU from the cart.
      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );
      // Get the existing quantity of the item in the cart, or default to 1.
      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );
      const qty: number = itemExists ? itemExists.qty + 1 : 1;
      // Add the new item to the cart.
      return { ...state, cart: [...filteredCart, { sku, name, price, qty }] };
    }
    // Remove an item from the cart.
    case REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) {
        throw new Error("action.payload is required");
      }
      const { sku } = action.payload;
      // Remove the item with the given SKU from the cart.
      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );
      return { ...state, cart: [...filteredCart] };
    }
    // Update the quantity of an item in the cart.
    case REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) {
        throw new Error("action.payload is required");
      }
      const { sku, qty } = action.payload;
      // Get the existing item from the cart.
      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );
      if (!itemExists) {
        throw new Error("item must exist in order to update quantity");
      }
      // Update the quantity of the item in the cart.
      const updatedItem: CartItemType = {
        ...itemExists,
        qty,
      };
      // Remove the existing item from the cart and add the updated item.
      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );
      return { ...state, cart: [...filteredCart, updatedItem] };
    }
    // Clear the cart.
    case REDUCER_ACTION_TYPE.SUBMIT: {
      return {
        ...state,
        cart: [],
      };
    }
    // Throw an error if an unknown action type is dispatched.
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Define a hook to provide access to the cart context and reducer.
const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initCartState);

  // Memoize the action types to prevent unnecessary re-renders.
  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);

  // Compute the total number of items in the cart.
  const totalItems = state.cart.reduce((previousValue, cartItem) => {
    return previousValue + cartItem.qty;
  }, 0);

  // Compute the total price of all items in the cart.
  const totalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    state.cart.reduce((previousValue, cartItem) => {
      return previousValue + cartItem.price * cartItem.qty;
    }, 0)
  );

  // Sort the cart items by SKU.
  const cart = state.cart.sort((a, b) => {
    const itemA = Number(a.sku.slice(-4));
    const itemB = Number(b.sku.slice(-4));
    return itemA - itemB;
  });

  return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart };
};

// Define a type for the hook return value.
export type UseCartContextType = ReturnType<typeof useCartContext>;

// Define the initial state for the cart context.
const initCartContextState: UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
  totalItems: 0,
  totalPrice: "",
  cart: [],
};

// Create a cart context that can be used throughout the app.
export const CartContext =
  createContext<UseCartContextType>(initCartContextState);

// Define a type for the children of the CartProvider component.
type ChildrenType = { children?: ReactElement | ReactElement[] };

// Create a provider component that wraps the app and provides access to the cart context.
export const CartProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <CartContext.Provider value={useCartContext(initCartState)}>
      {children}
    </CartContext.Provider>
  );
};

// Export the CartContext as the default export of this module.
export default CartContext;
