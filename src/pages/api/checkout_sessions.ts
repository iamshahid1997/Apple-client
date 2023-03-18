// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY =
  'sk_test_51MGciKSAVK3qNRELfk7cFk4WOtJ9yRn26wi6uEDVmB3NUXjmEt6UngcbXK8REzKMXj9Xy0N7aQrbFk5TG4tf6M2t001udh6BIM';

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
  typescript: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const items: any = req.body.items;

    // Shape in which Stripe expects the data
    const transformItems = items.map(
      (item: {
        product: {
          img: any;
          name: any;
          price: number;
          description: any;
        };
        quantity: number;
      }) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.product.name,
            images: [item.product.img],
          },
          unit_amount: item.product.price * item.quantity * 100,
        },
        quantity: 1,
      })
    );

    try {
      //Create Checkout Sessions from body Params
      const params: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: transformItems,
        payment_intent_data: {},
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout`,
        metadata: {
          images: JSON.stringify(
            items.map(
              (item: {
                product: {
                  img: string;
                };
              }) => item.product.img
            )
          ),
        },
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);
      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Internal server error';
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}
