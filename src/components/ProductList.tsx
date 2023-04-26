// Import necessary modules and hooks
import useCart from "../hooks/useCart";
import useProducts from "../hooks/useProducts";
import { UseProductsContextType } from "../context/ProductsProvider";
import { ReactElement } from "react";
import Product from "./Product";

// Define the ProductList component
const ProductList = () => {
  // Get the cart state and methods from the useCart hook
  const { dispatch, REDUCER_ACTIONS, cart } = useCart();
  // Get the products state from the useProducts hook
  const { products } = useProducts();

  // Initialize the page content with a loading message
  let pageContent: ReactElement | ReactElement[] = <p>Loading...</p>;

  // If there are products available, create a list of Product components
  if (products?.length) {
    pageContent = products.map((product) => {
      // Check if the current product is already in the cart
      const inCart: boolean = cart.some((item) => item.sku === product.sku);

      // Return a Product component with the necessary props
      return (
        <Product
          key={product.sku}
          product={product}
          dispatch={dispatch}
          REDUCER_ACTIONS={REDUCER_ACTIONS}
          inCart={inCart}
        />
      );
    });
  }

  // Wrap the page content in a main container
  const content = <main className="main main--products">{pageContent}</main>;

  // Return the content of the ProductList component
  return content;
};

// Export the ProductList component for use in other components
export default ProductList;
