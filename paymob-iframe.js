/**
 * Property Sisters Paymob Iframe JavaScript
 * Interactive features and smooth animations matching the website theme
 */

class PaymobPaymentInterface {
  constructor() {
    this.isLoading = false;
    this.paymentData = {
      amount: 0,
      rentalAmount: 0,
      serviceFee: 0,
      currency: 'EGP'
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializePaymentData();
    this.showLoadingScreen();
    this.initializeAnimations();
  }

  setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.method-card').forEach(card => {
      card.addEventListener('click', (e) => this.selectPaymentMethod(e));
    });

    // Form input formatting
    this.setupFormInputs();

    // Payment form submission
    document.getElementById('payment-form').addEventListener('submit', (e) => this.handlePayment(e));

    // Back button
    document.getElementById('back-btn').addEventListener('click', () => this.goBack());

    // Continue button in success modal
    document.getElementById('continue-btn').addEventListener('click', () => this.continueAfterSuccess());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
  }

  initializePaymentData() {
    // Get payment data from URL parameters or parent window
    const urlParams = new URLSearchParams(window.location.search);
    const amount = parseFloat(urlParams.get('amount')) || 1000;
    const serviceFee = Math.round(amount * 0.05); // 5% service fee
    const total = amount + serviceFee;

    this.paymentData = {
      amount: total,
      rentalAmount: amount,
      serviceFee: serviceFee,
      currency: 'EGP'
    };

    this.updateAmountDisplay();
  }

  updateAmountDisplay() {
    const { rentalAmount, serviceFee, amount } = this.paymentData;
    
    document.getElementById('rental-amount').textContent = this.formatCurrency(rentalAmount);
    document.getElementById('service-fee').textContent = this.formatCurrency(serviceFee);
    document.getElementById('total-amount').textContent = this.formatCurrency(amount);
    document.getElementById('payment-amount').textContent = this.formatCurrency(amount);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  showLoadingScreen() {
    // Simulate loading time for better UX
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
      document.getElementById('payment-container').classList.add('loaded');
    }, 2000);
  }

  initializeAnimations() {
    // Staggered animation for form elements
    const formElements = document.querySelectorAll('.form-group, .method-card, .amount-section');
    formElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 300 + (index * 100));
    });
  }

  selectPaymentMethod(event) {
    const selectedCard = event.currentTarget;
    const method = selectedCard.dataset.method;

    // Remove active class from all cards
    document.querySelectorAll('.method-card').forEach(card => {
      card.classList.remove('active');
    });

    // Add active class to selected card
    selectedCard.classList.add('active');

    // Show/hide form based on method
    this.togglePaymentForm(method);

    // Add selection animation
    selectedCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
      selectedCard.style.transform = 'scale(1)';
    }, 150);
  }

  togglePaymentForm(method) {
    const form = document.querySelector('.payment-form');
    
    if (method === 'card') {
      form.style.display = 'block';
      form.style.animation = 'slideInUp 0.4s ease-out';
    } else {
      form.style.display = 'none';
    }
  }

  setupFormInputs() {
    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e));

    // Expiry date formatting
    const expiryInput = document.getElementById('expiry-date');
    expiryInput.addEventListener('input', (e) => this.formatExpiryDate(e));

    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', (e) => this.formatCVV(e));

    // Real-time validation
    [cardNumberInput, expiryInput, cvvInput].forEach(input => {
      input.addEventListener('blur', () => this.validateInput(input));
    });
  }

  formatCardNumber(event) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substring(0, 19);
    }
    
    event.target.value = formattedValue;
    this.updateCardIcon(value);
  }

  formatExpiryDate(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    event.target.value = value;
  }

  formatCVV(event) {
    let value = event.target.value.replace(/\D/g, '');
    event.target.value = value;
  }

  updateCardIcon(cardNumber) {
    const cardIcons = document.querySelector('.card-icons');
    let icon = '💳';
    
    if (cardNumber.startsWith('4')) {
      icon = '💳'; // Visa
    } else if (cardNumber.startsWith('5')) {
      icon = '💳'; // Mastercard
    } else if (cardNumber.startsWith('3')) {
      icon = '💳'; // Amex
    }
    
    cardIcons.innerHTML = `<span class="card-icon">${icon}</span>`;
  }

  validateInput(input) {
    const value = input.value.trim();
    const fieldName = input.id;
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'card-number':
        const cardNumber = value.replace(/\s/g, '');
        isValid = this.validateCardNumber(cardNumber);
        errorMessage = isValid ? '' : 'Please enter a valid card number';
        break;
        
      case 'expiry-date':
        isValid = this.validateExpiryDate(value);
        errorMessage = isValid ? '' : 'Please enter a valid expiry date (MM/YY)';
        break;
        
      case 'cvv':
        isValid = this.validateCVV(value);
        errorMessage = isValid ? '' : 'Please enter a valid CVV (3-4 digits)';
        break;
        
      case 'cardholder-name':
        isValid = value.length >= 2;
        errorMessage = isValid ? '' : 'Please enter the cardholder name';
        break;
        
      case 'email':
        isValid = this.validateEmail(value);
        errorMessage = isValid ? '' : 'Please enter a valid email address';
        break;
    }

    this.showInputValidation(input, isValid, errorMessage);
    return isValid;
  }

  validateCardNumber(cardNumber) {
    // Luhn algorithm for card validation
    if (cardNumber.length < 13 || cardNumber.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  validateExpiryDate(expiry) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    return expiryDate > now;
  }

  validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
  }

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  showInputValidation(input, isValid, errorMessage) {
    // Remove existing validation classes
    input.classList.remove('valid', 'invalid');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    if (isValid) {
      input.classList.add('valid');
    } else {
      input.classList.add('invalid');
      
      // Add error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = errorMessage;
      errorDiv.style.color = 'var(--error-color)';
      errorDiv.style.fontSize = '0.875rem';
      errorDiv.style.marginTop = '0.25rem';
      
      input.parentNode.appendChild(errorDiv);
    }
  }

  handlePayment(event) {
    event.preventDefault();
    
    if (this.isLoading) return;
    
    // Validate all form fields
    const form = document.getElementById('payment-form');
    const inputs = form.querySelectorAll('input[required], input:not([type="hidden"])');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      this.showNotification('Please fix the errors in the form', 'error');
      return;
    }
    
    this.processPayment();
  }

  async processPayment() {
    this.isLoading = true;
    const payButton = document.getElementById('pay-btn');
    
    // Show loading state
    payButton.classList.add('loading');
    payButton.disabled = true;
    
    try {
      // Simulate payment processing
      await this.simulatePaymentProcessing();
      
      // Show success
      this.showSuccessModal();
      
    } catch (error) {
      this.showNotification('Payment failed. Please try again.', 'error');
      payButton.classList.remove('loading');
      payButton.disabled = false;
    }
    
    this.isLoading = false;
  }

  async simulatePaymentProcessing() {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Payment failed'));
        }
      }, 3000);
    });
  }

  showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('show');
    
    // Add confetti effect
    this.createConfettiEffect();
    
    // Auto-close after 5 seconds if user doesn't interact
    setTimeout(() => {
      if (modal.classList.contains('show')) {
        this.continueAfterSuccess();
      }
    }, 5000);
  }

  createConfettiEffect() {
    const colors = ['#b94a3b', '#9a3f33', '#d14639', '#dd6353'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10001';
        confetti.style.animation = 'confetti-fall 3s linear forwards';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 50);
    }
  }

  continueAfterSuccess() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('show');
    
    // Redirect to success page or close iframe
    if (window.parent !== window) {
      // If in iframe, notify parent
      window.parent.postMessage({ type: 'payment-success', data: this.paymentData }, '*');
    } else {
      // If standalone, redirect
      window.location.href = '/booking-success';
    }
  }

  goBack() {
    if (window.parent !== window) {
      // If in iframe, notify parent
      window.parent.postMessage({ type: 'payment-cancelled' }, '*');
    } else {
      // If standalone, go back
      window.history.back();
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      fontWeight: '500',
      zIndex: '10002',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      maxWidth: '300px',
      wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  handleKeyboardNavigation(event) {
    // ESC key to close modals
    if (event.key === 'Escape') {
      const modal = document.getElementById('success-modal');
      if (modal.classList.contains('show')) {
        this.continueAfterSuccess();
      }
    }
    
    // Enter key to submit form
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      const form = event.target.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit'));
      }
    }
  }
}

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes confetti-fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  
  .notification {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .form-input.valid {
    border-color: var(--success-color);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  .form-input.invalid {
    border-color: var(--error-color);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;
document.head.appendChild(style);

// Initialize the payment interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PaymobPaymentInterface();
});

// Handle messages from parent window (if in iframe)
window.addEventListener('message', (event) => {
  if (event.data.type === 'update-payment-data') {
    // Update payment data from parent
    const paymentInterface = window.paymentInterface;
    if (paymentInterface) {
      paymentInterface.paymentData = { ...paymentInterface.paymentData, ...event.data.data };
      paymentInterface.updateAmountDisplay();
    }
  }
});

// Export for external use
window.PaymobPaymentInterface = PaymobPaymentInterface;
