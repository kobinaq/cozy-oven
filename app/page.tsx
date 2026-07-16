import HomeClient from "./components/HomeClient";
import { fetchHomeFaqs, fetchHomeProducts } from "./lib/homeData";

export default async function HomePage() {
  const [products, faqs] = await Promise.all([
    fetchHomeProducts(),
    fetchHomeFaqs(),
  ]);

  return <HomeClient initialProducts={products} initialFaqs={faqs} />;
}
