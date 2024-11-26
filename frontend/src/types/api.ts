export interface ProductDetails {
    [key: string]: string | number | undefined;
  }
  
  export interface ProductProfit {
    productName: string;
    quantity: number;
    totalCost: number;
    totalProfit: number;
    attributes?: ProductDetails;
  }
  
  export interface Order {
    customer?: string;
    invoice_number?: string;
    productProfits: ProductProfit[];
    totalProfit?: number;
  }
  