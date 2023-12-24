const express = require("express");
const cors = require("cors");
const bosyparser = require("body-parser");
const PORT = 4242;

const app = express();
app.use(express.static('public'));
app.use(bosyparser.urlencoded({ extended: false }));
app.use(bosyparser.json());
app.use(cors({ origin: true, credentials: true}));

const stripe = require("stripe")("sk_test_51OPOORH9FOEzT9HiwGo2w0F6gzp0kq1RIa47X8Bh7IAMLR1LTaHfIgvy5qXelBGtycqaJiIHQ0PeTxot7bLUhyAR00kbLZuWB5");

app.post("/checkout",async (req ,res, next) => {
    try {
        // use pass that session to our request in cart , we will pass back to the res.is
        // need pass object, the data about our products we want to buy
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
        },
            shipping_options: [
            {
                shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 0,
                    currency: 'usd',
                },
                display_name: 'Free shipping',
                // Delivers between 5-7 business days
                delivery_estimate: {
                    minimum: {
                    unit: 'business_day',
                    value: 5,
                    },
                    maximum: {
                    unit: 'business_day',
                    value: 7,
                    },
                }
                }
            },
            {
                shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 1500,
                    currency: 'usd',
                },
                display_name: 'Next day air',
                // Delivers in exactly 1 business day
                delivery_estimate: {
                    minimum: {
                    unit: 'business_day',
                    value: 1,
                    },
                    maximum: {
                    unit: 'business_day',
                    value: 1,
                    },
                }
                }
            },
            ],
           line_items:  req.body.items.map((item) => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [item.product]
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          })),
           mode: "payment",
           success_url: "http://localhost:4242/success.html",
           cancel_url: "http://localhost:4242/cancel.html",
        });

        res.status(200).json(session);
    } catch (error) {
        // pass the error back
        next(error);
    }

})


app.listen(PORT,() => {
    console.log("listen To port " , PORT);
})

//https://stripe.com/docs/checkout/quickstart