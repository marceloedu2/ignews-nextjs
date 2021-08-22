import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../services/stripe";
import { query } from "faunadb";
import { fauna } from "../../services/fauna";

type UserProps = {
  ref: {
    id: string;
  };
  data: { stripe_customer_id: string };
};

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      user: { email, name },
    } = await getSession({ req });

    const user = await fauna.query<UserProps>(
      query.Get(
        query.Match(query.Index("user_by_email"), query.Casefold(email))
      )
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email,
      });

      await fauna.query(
        query.Update(query.Ref(query.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1JR6YjIM8pl1pZhx16cgCpLG",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

export default subscribe;
