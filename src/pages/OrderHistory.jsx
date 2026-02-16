import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, Eye, Filter } from 'lucide-react';
import { getMyOrders } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alerts';
import Button from '../components/ui/Button';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getMyOrders();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600 mb-8">View and track your order history</p>

        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filter === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('processing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filter === 'processing'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setFilter('shipped')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filter === 'shipped'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setFilter('delivered')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filter === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Delivered
              </button>
            </div>
            <div className="hidden md:flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{filteredOrders.length} orders</span>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-8">
              {filter === 'all'
                ? "You haven't placed any orders yet."
                : `No ${filter} orders found.`}
            </p>
            <Button onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          Order #{order._id.slice(-8)}
                        </span>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(order.orderDate)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="font-semibold text-gray-900">
                            ${(order.total * 1.1).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>

                      <Link
                        to={`/order/${order._id}`}
                        className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 font-medium"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex overflow-x-auto space-x-4 pb-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="shrink-0">
                          <img
                            src={item.imageUrl || 'https://via.placeholder.com/60x60?text=No+Image'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Track Your Order</h4>
              <p className="text-sm text-gray-600">
                Click on "View Details" to track your order status and get updates.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Return an Item</h4>
              <p className="text-sm text-gray-600">
                You can return items within 30 days of delivery. Contact support for assistance.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
              <p className="text-sm text-gray-600">
                Need help? Contact our customer support team for assistance with your orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;