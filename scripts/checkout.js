import {
  cart,
  removeFromCart,
  updateDeliveryOption
} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
/* ESM version */
// import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

import { deliveryOptions } from '../data/deliveryOptions.js';

/* External Libraries */
// hello();

// console.log(dayjs()); // object
// const today = dayjs();

// const deliveryDate = today.add(7, 'days');
// console.log(deliveryDate);  // 7天后的object

// console.log(deliveryDate.format('dddd, MMMM D')); // Friday, December 19
// deliveryDate.format('dddd, MMMM D');

function renderOrderSummary() {
  let cartSummaryHTML = '';

  /* MVC - use the Model to generate the View */
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    /* 循环查找产品id，找到匹配对象 */
    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });
    // console.log(matchingProduct);

    const deliveryOptionId = cartItem.deliveryOptionId;

    /* 根据id 来匹配deliveryOption */
    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `
      <div 
        class="
          cart-item-container 
          js-cart-item-container-${productId}
        "
      >
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${
                  cartItem.quantity
                }</span>
              </span>
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <span 
                class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}"
              >
                Delete
              </span>
            </div>
          </div>
          
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>        
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString =
        deliveryOption.priceCents === 0
          ? 'FREE'
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div 
          class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}"
        >
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>`;
    });
    return html;
  }

  document.querySelector('.order-summary').innerHTML = cartSummaryHTML;

  /* MVC - *when we interact with the View it will run the Controller */
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      // console.log('delete');

      const productId = link.dataset.productId;
      // console.log(productId);

      removeFromCart(productId);
      // console.log(cart);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;

      /* MVC - the Controller will update the Model */
      updateDeliveryOption(productId, deliveryOptionId);

      /* MVC - use the updated Model to regenerate the View */
      renderOrderSummary();
    });
  });
}

renderOrderSummary();
