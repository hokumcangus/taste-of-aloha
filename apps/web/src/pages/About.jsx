export default function About() {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About Taste of Aloha</h1>
      
      <div className="prose max-w-3xl">
        <p className="text-lg mb-4">
          Welcome to Taste of Aloha, where we bring authentic Hawaiian cuisine and culture 
          to your doorstep with the spirit of aloha.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Story</h2>
        <p className="mb-4">
          Founded with a passion for sharing the flavors of the Hawaiian islands, Taste of Aloha 
          combines traditional recipes with modern convenience through our delivery service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">What We Offer</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Restaurant - Traditional Hawaiian dishes</li>
          <li>Island Delights Grocery & Bakery - Fresh baked goods and local favorites</li>
          <li>Food Delivery Service - Fast and reliable delivery</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
        <p className="mb-4">
          To share authentic island flavors and the spirit of aloha with our community, 
          one delicious meal at a time.
        </p>
      </div>
    </div>
  );
}