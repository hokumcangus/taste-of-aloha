type SnackCard = {
    name: string;
    description: string;
    price: number;
};

function SnackCard({ name, description, price }: SnackCard) {
    return (
        <div className="snack-card">
            <h2>{name}</h2>
            <p>{description}</p>
            <p>Price: ${price.toFixed(2)}</p>
        </div>
    );
}
export default SnackCard;