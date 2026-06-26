import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { total } = req.body;

  if (!total || typeof total !== "number" || total <= 0) {
    return res.status(400).json({ error: "Total inválido" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      // Stripe trabaja en centavos — multiplicamos por 100
      amount: Math.round(total * 100),
      currency: "mxn",
      automatic_payment_methods: { enabled: true },
      metadata: { app: "fresaspalace" },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message || "Error al crear el pago" });
  }
}
