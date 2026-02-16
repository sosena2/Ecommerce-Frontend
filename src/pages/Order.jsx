import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, CreditCard, Calendar, MapPin } from 'lucide-react';
import { getOrderById } from '../services/orderService';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alerts';
import Button from '../components/ui/Button';

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);
        setOrder(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load order');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" title="Error" message={error || 'Order not found'} />
        <Button onClick={() => navigate('/orders')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/orders')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
              <p className="text-gray-600 mt-2">
                Placed on {formatDate(order.orderDate)}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/60x60?text=No+Image'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['pending', 'processing', 'shipped', 'delivered'].includes(order.status)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Order Confirmed</h4>
                    <p className="text-sm text-gray-600">Your order has been confirmed</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.orderDate)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['processing', 'shipped', 'delivered'].includes(order.status)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Package className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Processing</h4>
                    <p className="text-sm text-gray-600">Your order is being processed</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['shipped', 'delivered'].includes(order.status)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Truck className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Shipped</h4>
                    <p className="text-sm text-gray-600">Your order has been shipped</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Delivered</h4>
                    <p className="text-sm text-gray-600">Your order has been delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                
                {order.customer && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-gray-600">{order.customer.address}</p>
                      <p className="text-gray-600">{order.customer.phone}</p>
                      <p className="text-gray-600">{order.customer.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">{order.paymentMethod || 'Credit Card'}</p>
                    {order.isPaid && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                        Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Total</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(order.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(order.total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions</h2>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Download Invoice
                </Button>
                {order.status === 'pending' && (
                  <Button className="w-full" variant="outline">
                    Cancel Order
                  </Button>
                )}
                <Button className="w-full" variant="outline">
                  Contact Support
                </Button>
                <Button className="w-full" onClick={() => navigate('/products')}>
                  Shop Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;