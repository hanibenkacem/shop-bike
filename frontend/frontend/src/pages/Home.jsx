import { useEffect, useState } from "react";

import API from "../api/axios";

import MainLayout from "../layouts/MainLayout";

import Hero from "../components/Hero";

import CategoryCard from "../components/CategoryCard";

export default function Home() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {

    try {

      const res = await API.get("/categories");
      console.log("API Response:", res.data); // Look at this in your browser console!
      setCategories(res.data);

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <MainLayout>

      {/* HERO SECTION */}
      <Hero />

      {/* CATEGORIES */}
      <section
        id="categories"
        style={{
          padding: "50px"
        }}
      >

        <h1
          style={{
            fontSize: "40px",
            marginBottom: "30px"
          }}
        >
          الفئات
        </h1>

        <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    alignItems: "stretch"
  }}
>

  {categories.map(category => (

    <CategoryCard
      key={category.id}
      category={category}
    />

  ))}

</div>

      </section>

    </MainLayout>
  );
}