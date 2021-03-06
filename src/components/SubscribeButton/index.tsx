import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripeJs";
import styles from "./styles.module.scss";

interface ISubscribeButton {
  priceId: string;
}

const SubscribeButton = ({ priceId }: ISubscribeButton) => {
  const [session] = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      signIn("github");
      return;
    }

    if (session.activeSubscription) {
      return router.push("/posts");
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;
      console.log(sessionId);

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};

export default SubscribeButton;
