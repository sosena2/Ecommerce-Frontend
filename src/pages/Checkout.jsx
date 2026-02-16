import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Package, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import PaymentMethods from '../components/checkout/PaymentMethods';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alerts';
import { toast } from 'react-hot-toast';
import { createOrder } from '../services/orderService';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !shippingInfo[field]);
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`);
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    try {
      const orderItems = cart.items.map((item) => ({
        product: item.productId || item.product?._id || item.product,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        image: item.imageUrl,
      }));

      const itemsPrice = cartTotal;
      const shippingPrice = itemsPrice > 50 ? 0 : 5.99;
      const taxPrice = itemsPrice * 0.1;
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      const orderData = {
        customer: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
          phone: shippingInfo.phone
        },
        shippingAddress: {
          ...shippingInfo
        },
        paymentMethod: paymentMethod,
        items: cart.items,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        total: cartTotal
      };

      const response = await createOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/order/${response._id || response.data?._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Alert 
            type="warning" 
            title="Your cart is empty"
            message="Please add items to your cart before proceeding to checkout."
          />
          <Button onClick={() => navigate('/products')} className="mt-4">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">Complete your purchase securely</p>

        {/* Checkout Steps */}
        <CheckoutSteps currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {step === 1 && (
                <div>
                  <div className="flex items-center mb-6">
                    <MapPin className="h-6 w-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleShippingChange}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      required
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                    />
                    <Input
                      label="Address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                    />
                    <Input
                      label="City"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      required
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-6 w-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                  </div>
                  
                  <PaymentMethods
                    selectedMethod={paymentMethod}
                    onSelect={setPaymentMethod}
                  />
                  
                  {paymentMethod === 'card' && (
                    <div className="mt-6 space-y-4">
                      <Input
                        label="Card Number"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentDetailsChange}
                        placeholder="1234 5678 9012 3456"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          name="expiry"
                          value={paymentDetails.expiry}
                          onChange={handlePaymentDetailsChange}
                          placeholder="MM/YY"
                        />
                        <Input
                          label="CVV"
                          name="cvv"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentDetailsChange}
                          placeholder="123"
                        />
                      </div>
                      <Input
                        label="Name on Card"
                        name="nameOnCard"
                        value={paymentDetails.nameOnCard}
                        onChange={handlePaymentDetailsChange}
                      />
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="flex items-center mb-6">
                    <Package className="h-6 w-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Order Review</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                      <div className="space-y-3">
                        {cart.items.map((item) => (
                          <div key={item.productId} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price}</p>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Shipping Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{shippingInfo.name}</p>
                        <p className="text-gray-600">{shippingInfo.address}</p>
                        <p className="text-gray-600">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p className="text-gray-600">{shippingInfo.country}</p>
                        <p className="text-gray-600">{shippingInfo.phone}</p>
                        <p className="text-gray-600">{shippingInfo.email}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium capitalize">{paymentMethod}</p>
                        {paymentMethod === 'card' && (
                          <p className="text-gray-600">Card ending in •••• {paymentDetails.cardNumber.slice(-4)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been received and is being processed.
                  </p>
                  <Button onClick={() => navigate('/orders')}>
                    View My Orders
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {step < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    disabled={step === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={step === 3 ? handlePlaceOrder : handleNextStep}
                    loading={loading}
                  >
                    {step === 3 ? 'Place Order' : 'Continue'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          {step < 4 && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Items in your order</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {cart.items.map((item) => (
                      <div key={item.productId} className="flex items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                          }}
                        />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;