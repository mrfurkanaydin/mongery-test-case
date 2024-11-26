export interface TableData {
    key: string;
    customerOrProduct: string | { companyname: string } | null;
    invoiceNumber: string;
    totalQuantity: number;
    totalAmount: number;
    totalCost: number;
    totalProfit: number;
    netProfit: number;
    productDetails?: Record<string, string | number | undefined>;
  }
  