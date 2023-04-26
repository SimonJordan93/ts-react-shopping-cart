// Import necessary modules from the React library
import { createContext, ReactElement, useState, useEffect } from "react";

// Define the type for a product object
export type ProductType = {
  sku: string;
  name: string;
  price: number;
};

// Uncomment the following line to initialize an empty product array
// const initState: ProductType[] = [];

// Initialize an array with three sample products for demonstration purposes
const initState: ProductType[] = [
  {
    sku: "item0001",
    name: "Widget",
    price: 9.99,
  },
  {
    sku: "item0002",
    name: "Premium Widget",
    price: 19.99,
  },
  {
    sku: "item0003",
    name: "Deluxe Widget",
    price: 29.99,
  },
];

// Define the context type for a list of products
export type UseProductsContextType = {
  products: ProductType[];
};

// Initialize the context state object
const initContextState: UseProductsContextType = {
  products: [],
};

// Create a new context for products using the initialized state
const ProductsContext = createContext<UseProductsContextType>(initContextState);

// Define the type for children elements
type ChildrenType = { children?: ReactElement | ReactElement[] };

// Create a Provider component for the ProductsContext to provide products to child components
export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
  // Define the products state using the useState hook
  const [products, setProducts] = useState<ProductType[]>(initState);

  // Uncomment the following useEffect to fetch products from an API
  // useEffect(() => {
  //   const fetchProducts = async (): Promise<ProductType[]> => {
  //     const data = await fetch("http://localhost:3500/products")
  //       .then((res) => res.json())
  //       .catch((err) => {
  //         if (err instanceof Error) {
  //           console.log(err.message);
  //         }
  //       });
  //     return data;
  //   };
  //   fetchProducts().then((products) => setProducts(products));
  // }, []);

  // Return the Provider component with the products state passed as a value prop
  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};

// Export the ProductsContext for use in other components
export default ProductsContext;
