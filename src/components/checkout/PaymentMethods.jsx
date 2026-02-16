import { CreditCard, DollarSign, Wallet } from 'lucide-react';

const PaymentMethods = ({ selectedMethod, onSelect }) => {
  const methods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay with your credit or debit card',
      popular: true,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: DollarSign,
      description: 'Pay with your PayPal account',
      popular: false,
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Apple Pay, Google Pay, etc.',
      popular: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
      <p className="text-gray-600 mb-4">Select your preferred payment method</p>
      
      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`w-full text-left p-4 border rounded-lg transition-all ${
                selectedMethod === method.id
                  ? 'border-primary-600 ring-2 ring-primary-100 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    selectedMethod === method.id
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{method.name}</span>
                      {method.popular && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="h-2 w-2 rounded-full bg-white mx-auto mt-0.5" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Your payment information is encrypted and secure
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;