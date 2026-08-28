import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalRequestId = session.metadata?.rentalRequestId;

  if (!rentalRequestId) {
    throw new Error("Rental Request ID not found");
  }

  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: {
      id: rentalRequestId,
    },
  });

  await prisma.payment.upsert({
    where: {
      rentalRequestId,
    },

    create: {
      rentalRequestId,
      amount: rentalRequest.totalAmount,
      status: "PAID",
      stripeCustomerId: session.customer as string,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    },

    update: {
      status: "PAID",
      stripeCustomerId: session.customer as string,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    },
  });
};
