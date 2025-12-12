export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [
    {
      productId: 'e4f64a65-1377-42bc-89a5-e572d19252e2',
      quantity: 2,
      deliveryOptionId: '2'
    },
    {
      productId: 'b0f17cc5-8b40-4ca5-9142-b61fe3d98c85',
      quantity: 1,
      deliveryOptionId: '1'
    },
    {
      productId: '4f4fbcc2-4e72-45cc-935c-9e13d79cc57f',
      quantity: 1,
      deliveryOptionId: '3'
    }
  ];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
export function addToCart(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1,
      deliveryOptionId: '1'
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}
