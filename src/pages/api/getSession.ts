// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
const STRIPE_SECRET_KEY =
  'sk_test_51MGciKSAVK3qNRELfk7cFk4WOtJ9yRn26wi6uEDVmB3NUXjmEt6UngcbXK8REzKMXj9Xy0N7aQrbFk5TG4tf6M2t001udh6BIM';
const stripe: Stripe = require("stripe")(STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionId = req.query.session_id as string;

  const session = await stripe.checkout.sessions.listLineItems(sessionId);

  res.status(200).json({
    session,
  });
}