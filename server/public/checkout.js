// This is your test publishable API key.
const stripe = Stripe("pk_test_51OPOORH9FOEzT9HisBrQz2gs7P9XpvGEL16X8v6TPM2G728C1Dhk8jt7RgOvI8UmIJxkDhnzRClQMCo0hFoWFReL00BjMYOLst");

initialize();

// Create a Checkout Session as soon as the page loads
async function initialize() {
  const response = await fetch("/create-checkout-session", {
    method: "POST",
  });

  const { clientSecret } = await response.json();

  const checkout = await stripe.initEmbeddedCheckout({
    clientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}