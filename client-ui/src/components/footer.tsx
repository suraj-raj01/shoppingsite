import BASE_URL from "@/Config";
import FooterSkeleton from "@/pages/skeletons/FooterSkeleton";
import axios from "axios";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Subcategories = {
  _id: string;
  name: string;
  brands: string[];
};

type Category = {
  _id: string;
  categories: string;
  subcategories: Subcategories[];
};

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URL}/api/admin/category`);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto md:px-10 px-5 py-10">

        {/* TOP SECTION */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">

          {/* ABOUT */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About Us</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We are a family owned business serving across India since 2025.
              We are committed to delivering high-quality products and excellent service.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <p className="text-gray-400 text-sm">+91 6206546029</p>
            <p className="text-gray-400 text-sm">surajk2526@gmail.com</p>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  to="#"
                  className="border border-gray-500 p-2 rounded-full hover:bg-white hover:text-green-500 transition"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* CATEGORY SECTION */}
        {loading ? (
          <FooterSkeleton />
        ) : (
          <div className="grid gap-0 grid-cols-2 md:grid-cols-5 w-full lg:grid-cols-5">
            {categories.map((category) => (
              <div key={category._id}>
                
                {/* CATEGORY TITLE */}
                <h4 className="font-semibold text-sm pb-2 border-b border-gray-700 uppercase">
                  {category.categories}
                </h4>

                {/* SUBCATEGORIES */}
                <div className="space-y-3 border-l border-gray-700 p-2 grid grid-cols-2">
                  {category.subcategories?.map((sub) => (
                    <div key={sub._id}>
                      
                      {/* SUBCATEGORY */}
                      <Link
                        to={`/products/${sub._id}`}
                        className="text-sm font-semibold text-gray-300 hover:text-gray-100"
                      >
                        {sub.name}
                      </Link>

                      {/* BRANDS */}
                      <div className="ml-2 mt-1 space-y-1">
                        {sub.brands?.map((brand) => (
                          <Link
                            key={brand}
                            to={`/products/${brand}`}
                            className="block text-xs text-gray-400 hover:text-white"
                          >
                            {brand}
                          </Link>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* BOTTOM */}
        <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} www.shopingsite.com | All rights reserved.
        </div>

      </div>
    </footer>
  );
}