import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Subcategory = {
  name: string;
  brands: string[];
};

type CategoryFormState = {
  categories: string;
  categoriesImg: string;
  subcategories: Subcategory[];
};

const CategoryForm: React.FC = () => {
  const { id } = useParams(); // id optional for update
  const navigate = useNavigate();

  const [form, setForm] = useState<CategoryFormState>({
    categories: "",
    categoriesImg: "",
    subcategories: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return ""
    try {
      const fd = new FormData()
      fd.append("image", imageFile)

      const res = await axios.post(
        `${BASE_URL}/api/admin/upload/single`,
        fd
      )

      return res.data.url
    } catch (err) {
      console.error("Image upload failed", err)
      toast.error("Image upload failed")
      return ""
    }
  }

  // Fetch category if editing
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/category/${id}`);
        setForm(res.data);
        if (res.data.categoriesImg) {
          setPreview(res.data.categoriesImg);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategory();
  }, [id]);

  // Handle category name
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, categories: e.target.value });
  };

  // Add subcategory
  const addSubcategory = () => {
    setForm({
      ...form,
      subcategories: [...form.subcategories, { name: "", brands: [] }],
    });
  };

  // Remove subcategory
  const removeSubcategory = (index: number) => {
    const updated = [...form.subcategories];
    updated.splice(index, 1);
    setForm({ ...form, subcategories: updated });
  };

  // Change subcategory name
  const handleSubcategoryName = (index: number, value: string) => {
    const updated = [...form.subcategories];
    updated[index].name = value;
    setForm({ ...form, subcategories: updated });
  };

  // Add brand
  const addBrand = (index: number) => {
    const updated = [...form.subcategories];
    updated[index].brands.push("");
    setForm({ ...form, subcategories: updated });
  };

  // Change brand
  const handleBrandChange = (
    subIndex: number,
    brandIndex: number,
    value: string
  ) => {
    const updated = [...form.subcategories];
    updated[subIndex].brands[brandIndex] = value;
    setForm({ ...form, subcategories: updated });
  };

  // Remove brand
  const removeBrand = (subIndex: number, brandIndex: number) => {
    const updated = [...form.subcategories];
    updated[subIndex].brands.splice(brandIndex, 1);
    setForm({ ...form, subcategories: updated });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Upload image if selected
      if (imageFile) {
        const imageUrl = await uploadImageToCloudinary();
        form.categoriesImg = imageUrl;
      }

      if (id) {
        await axios.put(`${BASE_URL}/api/admin/category/${id}`, form);
      } else {
        await axios.post(`${BASE_URL}/api/admin/category`, form);
      }
      navigate("/dashboard/categoriestable");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <p className="text-muted-foreground">
                  Manage and track all the categories
                </p>
              </div>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Button onClick={() => { navigate("/dashboard/categoriestable") }}>
            Category Table
          </Button>
        )}
      </div>
      <Card className="w-full mx-auto mt-5 max-w-3xl">
        <CardHeader>
          <CardTitle>{id ? "Update Category" : "Create Category"}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category Name */}
            <div>
              <Label>Category Name</Label>
              <Input
                value={form.categories}
                onChange={handleCategoryChange}
                placeholder="Enter category"
              />
            </div>

            <div className="grid gap-0">
              <Label htmlFor="profile">Category Image</Label>
              <div className="space-y-2 md:col-span-1">
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                {/* PREVIEW */}
                {preview && (
                  <div className="md:col-span-1">
                    <img
                      src={preview}
                      alt="preview"
                      className="h-20 rounded-sm border object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Subcategories */}
            <div className="space-y-4">
              {form.subcategories.map((sub, subIndex) => (
                <Card key={subIndex} className="p-4 space-y-3">
                  <Input
                    placeholder="Subcategory name"
                    value={sub.name}
                    onChange={(e) =>
                      handleSubcategoryName(subIndex, e.target.value)
                    }
                  />

                  {/* Brands */}
                  <div className="space-y-2 -mt-6">
                    <Label>Brands</Label>

                    {sub.brands.map((brand, brandIndex) => (
                      <div key={brandIndex} className="flex gap-2">
                        <Input
                          placeholder="Brand name"
                          value={brand}
                          onChange={(e) =>
                            handleBrandChange(
                              subIndex,
                              brandIndex,
                              e.target.value
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() =>
                            removeBrand(subIndex, brandIndex)
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => addBrand(subIndex)}
                    >
                      Add Brand
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeSubcategory(subIndex)}
                  >
                    Remove Subcategory
                  </Button>
                </Card>
              ))}
              <div className="flex justify-between items-center">
                <Label>Subcategories</Label>
                <Button type="button" onClick={addSubcategory}>
                  Add Subcategory
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : id ? "Update Category" : "Create Category"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;
