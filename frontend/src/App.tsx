import React, { useEffect, useState } from "react";
import { Table, Select, Typography, Space, Tag, Modal } from "antd";
import { useCalculateProfitMutation } from "./context/apiSlice";
import { Order } from "./types/api";
import { TableData } from "./types/table";

const { Title } = Typography;
const { Option } = Select;


const App: React.FC = () => {
  const [calculateProfit] = useCalculateProfitMutation();

  const [filterType, setFilterType] = useState<"Siparişe Göre" | "Ürüne Göre">("Siparişe Göre");
  const [currency, setCurrency] = useState<"USD" | "TL">("USD");
  const [profitResults, setProfitResults] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<TableData | null>(null); 

  const handleCalculation = async () => {
    try {
      const result = await calculateProfit({ filterType, currency }).unwrap();
      setProfitResults(result);
    } catch (error) {
      console.error("Error fetching profit calculation:", error);
    }
  };

  useEffect(() => {
    handleCalculation();
  }, [currency]);

  const handleProductClick = (product: TableData) => {
    setSelectedProduct(product); 
  };

  const closeModal = () => {
    setSelectedProduct(null); 
  };

  const columns = [
    {
      title: filterType === "Siparişe Göre" ? "Müşteri" : "Ürün",
      dataIndex: "customerOrProduct",
      key: "customerOrProduct",
      render: (text: string | { companyname: string } | null, record: TableData) =>
        filterType === "Siparişe Göre" ? (
          <span>{(text as { companyname: string })?.companyname || "N/A"}</span>
        ) : (
          <Tag
            color="purple"
            style={{ cursor: "pointer" }}
            onClick={() => handleProductClick(record)}
          >
            {text as string}
          </Tag>
        ),
    },
    {
      title: "Fatura Numarası",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Toplam Miktar",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      render: (text: number) => `${text.toFixed(4)} ton`,
    },
    {
      title: "Toplam Tutar",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text: number) => `${text.toFixed(2)} ${currency}`,
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (text: number) => `${text.toFixed(2)} ${currency}`,
    },
    {
      title: "Toplam Karlılık",
      dataIndex: "totalProfit",
      key: "totalProfit",
      render: (text: number) => (
        <Tag style={{ color: text >= 0 ? "green" : "red" }}>
          {text.toFixed(2)} {currency}
        </Tag>
      ),
    },
    {
      title: "Net Kar (Cüneyt Bey)",
      dataIndex: "netProfit",
      key: "netProfit",
      render: (text: number) => (
        <Tag style={{ color: text >= 0 ? "green" : "red" }}>
          {text.toFixed(2)} {currency}
        </Tag>
      ),
    },
  ];

  const data: TableData[] =
    filterType === "Siparişe Göre"
      ? profitResults.map((item, index) => ({
          key: index.toString(),
          customerOrProduct: item.customer ? JSON.parse(item.customer) : null,
          invoiceNumber: item.invoice_number || "N/A",
          totalQuantity: Number(
            item.productProfits.reduce((sum, p) => sum + p.quantity, 0)
          ),
          totalAmount: item.productProfits.reduce((sum, p) => sum + p.totalCost, 0),
          totalCost: item.productProfits.reduce((sum, p) => sum + p.totalCost, 0),
          totalProfit: item.totalProfit || 0,
          netProfit: item.totalProfit ? item.totalProfit * 0.375 : 0,
        }))
      : profitResults.flatMap((item, orderIndex) =>
          item.productProfits.map((product, productIndex) => ({
            key: `${orderIndex}-${productIndex}`,
            customerOrProduct: product.productName,
            invoiceNumber: item.invoice_number || "N/A",
            totalQuantity: product.quantity,
            totalAmount: product.totalCost,
            totalCost: product.totalCost,
            totalProfit: product.totalProfit,
            netProfit: product.totalProfit ? product.totalProfit * 0.375 : 0,
            productDetails: product.attributes,
          }))
        );

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Karlılık</Title>

      <Space style={{ marginBottom: "20px" }}>
        <Select
          value={filterType}
          onChange={(value: "Siparişe Göre" | "Ürüne Göre") => setFilterType(value)}
          style={{ width: 200 }}
        >
          <Option value="Siparişe Göre">Siparişe Göre</Option>
          <Option value="Ürüne Göre">Ürüne Göre</Option>
        </Select>
        <Select
          value={currency}
          onChange={(value: "USD" | "TL") => setCurrency(value)}
          style={{ width: 200 }}
        >
          <Option value="USD">USD</Option>
          <Option value="TL">TL</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Ürün Detayları"
        open={!!selectedProduct}
        onCancel={closeModal}
        footer={null}
      >
        {selectedProduct && selectedProduct.productDetails ? (
          <div>
            {Object.entries(selectedProduct.productDetails).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ) : (
          <p>Detay bulunamadı.</p>
        )}
      </Modal>
    </div>
  );
};

export default App;
