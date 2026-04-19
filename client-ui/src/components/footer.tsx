import BASE_URL from "@/Config";
import FooterSkeleton from "@/pages/skeletons/FooterSkeleton";
import Footer1Skeleton from "@/pages/skeletons/FooterSkeleton1";
import axios from "axios";
import { icons } from "lucide-react";
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

type Footer = {
  aboutTitle: string;
  aboutDesc: string;
  contactTitle: string;
  contactDesc: string;
  followus: string;
  icons: { title: string, url: string }[];
  copyright: string;
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [footer, setFooter] = useState<Footer>();
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URL}/api/admin/category`);
      const footer = await axios.get(`${BASE_URL}/api/admin/footer`);
      setFooter(footer?.data?.data[0] || { aboutTitle: "", aboutDesc: "", contactTitle: "", contactDesc: "", socialTitle: "", socialDesc: "" })
      // console.log(footer.data?.data[0],'footer');
      setCategories(res.data?.data || []);
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
      <div className="mx-auto md:px-7 px-3 py-8">

        {/* TOP SECTION */}
        {loading ? (
          <Footer1Skeleton />
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">

            {/* ABOUT */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{footer?.aboutTitle}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {footer?.aboutDesc}
              </p>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{footer?.contactTitle}</h3>
              <p className="text-gray-400 text-sm">{footer?.contactDesc.split(",").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</p>
            </div>

            {/* SOCIAL */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{footer?.followus}</h3>
              <div className="flex gap-3">
                {footer?.icons.map((icon, i) => {
                  const IconComponent = icons[icon.title as keyof typeof icons];
                  return (
                    <Link
                      key={i}
                      to={icon.url}
                      className="border border-gray-500 p-2 h-10 w-10 flex items-center justify-center rounded-full hover:bg-background hover:text-[#6096ff] transition"
                    >
                      {IconComponent ? <IconComponent size={18} className="capitalize" /> : <span className="">{icon.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
          {footer?.copyright}
        </div>

      </div>
    </footer>
  );
}