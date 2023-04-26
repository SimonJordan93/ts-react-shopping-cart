// Import necessary modules and types
import { ProductType } from "../context/ProductsProvider";
import { ReducerActionType, ReducerAction } from "../context/CartProvider";
import { ReactElement, memo } from "react";

// Define the PropsType for the Product component
type PropsType = {
  product: ProductType;
  dispatch: React.Dispatch<ReducerAction>;
  REDUCER_ACTIONS: ReducerActionType;
  inCart: boolean;
};

// Define the Product component
const Product = ({
  product,
  dispatch,
  REDUCER_ACTIONS,
  inCart,
}: PropsType): ReactElement => {
  // Construct the image URL for the product
  const img: string = new URL(`../img/${product.sku}.jpg`, import.meta.url)
    .href;

  // Define the onAddToCart function to handle adding the product to the cart
  const onAddToCart = () =>
    dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, qty: 1 } });

  // Display an indicator if the item is already in the cart
  const itemInCart = inCart ? " → Item in Cart: ✔️" : null;

  // Define the content of the Product component
  const content = (
    <article className="product">
      <h3>{product.name}</h3>
      <img className="product__img" src={img} alt={product.name} />
      <p>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}{" "}
        {itemInCart}
      </p>
      <button onClick={onAddToCart}>Add To Cart</button>
    </article>
  );

  // Return the content of the Product component
  return content;
};

// Define the areProductsEqual function to compare two products for memoization
function areProductsEqual(
  { product: prevProduct, inCart: prevInCart }: PropsType,
  { product: nextProduct, inCart: nextInCart }: PropsType
) {
  return (
    Object.keys(prevProduct).every((key) => {
      return (
        prevProduct[key as keyof ProductType] ===
        nextProduct[key as keyof ProductType]
      );
    }) && prevInCart === nextInCart
  );
}

// Create a memoized version of the Product component to prevent unnecessary renders
const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual);

// Export the Product component for use in other components
export default MemoizedProduct;
