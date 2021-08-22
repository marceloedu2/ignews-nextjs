import styles from "./styles.module.scss";

interface ISubscribeButton {
  priceId: string;
}

const SubscribeButton = ({ priceId }: ISubscribeButton) => {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
};

export default SubscribeButton;
