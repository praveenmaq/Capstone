// Order Status Enum
export const OrderStatus = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
};

// Payment Status Enum
export const PaymentStatus = {
  PENDING: 0,
  PAID: 1,
  FAILED: 2,
};

// Payment Method Enum
export const PaymentMethod = {
  CREDIT_CARD: 0,
  DEBIT_CARD: 1,
  NET_BANKING: 2,
  UPI: 3,
  CASH_ON_DELIVERY: 4,
};

// Reverse mappings for displaying values
export const OrderStatusLabels = {
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.FAILED]: "Failed",
};

export const PaymentStatusLabels = {
  [PaymentStatus.PENDING]: "Pending",
  [PaymentStatus.PAID]: "Paid",
  [PaymentStatus.FAILED]: "Failed",
};

export const PaymentMethodLabels = {
  [PaymentMethod.CREDIT_CARD]: "Credit Card",
  [PaymentMethod.DEBIT_CARD]: "Debit Card",
  [PaymentMethod.NET_BANKING]: "Net Banking",
  [PaymentMethod.UPI]: "UPI",
  [PaymentMethod.CASH_ON_DELIVERY]: "Cash on Delivery",
};

// Helper functions to get labels
export const getOrderStatusLabel = (status) => {
  return OrderStatusLabels[status] || "Unknown";
};

export const getPaymentStatusLabel = (paymentStatus) => {
  return PaymentStatusLabels[paymentStatus] || "Unknown";
};

export const getPaymentMethodLabel = (paymentMethod) => {
  return PaymentMethodLabels[paymentMethod] || "Unknown";
};

// Helper functions to get all options for dropdowns
export const getOrderStatusOptions = () => {
  return Object.entries(OrderStatusLabels).map(([value, label]) => ({
    value: parseInt(value),
    label,
  }));
};

export const getPaymentStatusOptions = () => {
  return Object.entries(PaymentStatusLabels).map(([value, label]) => ({
    value: parseInt(value),
    label,
  }));
};

export const getPaymentMethodOptions = () => {
  return Object.entries(PaymentMethodLabels).map(([value, label]) => ({
    value: parseInt(value),
    label,
  }));
};

// Status and color mappings for UI
export const getOrderStatusColor = (status) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.FAILED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPaymentStatusColor = (paymentStatus) => {
  switch (paymentStatus) {
    case PaymentStatus.PAID:
      return "bg-green-100 text-green-800";
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case PaymentStatus.FAILED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
