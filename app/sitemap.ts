import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

// Initialize supabase client inside sitemap.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rxihusojlhtmbohdxmju.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://hbsmarket.com";

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/customer-login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/customer-register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store-login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store-register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/customer`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/requests`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/promo`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  try {
    // Fetch dynamic products from offerable_items table
    const { data: products, error: productsError } = await supabase
      .from("offerable_items")
      .select("id, created_at")
      .eq("is_visible_in_storefront", true);

    // Fetch dynamic companies (stores) from companies table
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("code, created_at");

    const dynamicRoutes: MetadataRoute.Sitemap = [];

    if (products && !productsError) {
      products.forEach((product) => {
        if (product.id) {
          dynamicRoutes.push({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: product.created_at ? new Date(product.created_at) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          });
        }
      });
    }

    if (companies && !companiesError) {
      companies.forEach((company) => {
        if (company.code) {
          dynamicRoutes.push({
            url: `${baseUrl}/store/${company.code}`,
            lastModified: company.created_at ? new Date(company.created_at) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          });
        }
      });
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
    return staticRoutes;
  }
}
