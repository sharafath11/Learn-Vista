import { stripe } from "@/src/lib/stripe"

export async function getStripeCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer"],
    })

    const paymentIntent = session.payment_intent as any

    return {
      customer_email: session.customer_details?.email || "",
      amount_total: session.amount_total || 0,
      receipt_url: paymentIntent?.charges?.data?.[0]?.receipt_url || "",
    }
  } catch (error) {
    console.error("Error fetching Stripe session:", error)
    return null
  }
}
