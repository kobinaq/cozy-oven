import {
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: number;
  total: number;
  status: string;
  date: string;
  deliveryAddress: string;
}

interface OrderCardsProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "processing":
      return "bg-blue-100 text-blue-700";
    case "shipped":
      return "bg-purple-100 text-purple-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "processing":
      return <Package className="w-4 h-4" />;
    case "shipped":
      return <Truck className="w-4 h-4" />;
    case "delivered":
      return <CheckCircle className="w-4 h-4" />;
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function OrderCards({ orders, onViewOrder }: OrderCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
              <p className="text-sm text-gray-500">{order.customerEmail}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              {(order.status?.charAt(0) || "").toUpperCase() + (order.status?.slice(1) || "")}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="text-sm font-medium text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Items</p>
              <p className="text-sm font-medium text-gray-900">{order.items}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-sm font-semibold text-gray-900">GHS {order.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
            <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onViewOrder(order)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
