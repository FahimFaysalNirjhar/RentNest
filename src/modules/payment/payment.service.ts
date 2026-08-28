import Stripe from "stripe";
import { RentalRequestStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";

const createCheckoutSession = async (requestId: string) => {
  const paymentUrl = await prisma.$transaction(async (tx) => {
    const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
      where: {
        id: requestId,
      },
      include: {
        tenant: {
          omit: {
            password: true,
          },
        },
        property: {
          include: {
            landlord: {
              omit: {
                password: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (rentalRequest.status !== RentalRequestStatus.ACCEPTED) {
      throw new Error(
        "Payment is only available for accepted rental requests.",
      );
    }

    if (rentalRequest.payment?.status === "PAID") {
      throw new Error("This rental request has already been paid.");
    }

    let stripeCustomerId = rentalRequest.payment?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: rentalRequest.tenant.email,
        name: rentalRequest.tenant.name,
        metadata: {
          rentalRequestId: rentalRequest.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: rentalRequest.property.title,
              description: rentalRequest.property.description ?? "",
            },
            unit_amount: Math.round(rentalRequest.totalAmount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.app_url}/payment/cancel`,

      metadata: {
        rentalRequestId: rentalRequest.id,
      },
    });

    await tx.payment.upsert({
      where: {
        rentalRequestId: rentalRequest.id,
      },
      create: {
        rentalRequestId: rentalRequest.id,
        amount: rentalRequest.totalAmount,
        stripeCustomerId,
        stripeSessionId: session.id,
      },
      update: {
        stripeCustomerId,
        stripeSessionId: session.id,
      },
    });

    return session.url;
  });

  return {
    paymentUrl,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret!,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    default:
      console.log(`Unhandled event: ${event.type}`);
  }
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
};
