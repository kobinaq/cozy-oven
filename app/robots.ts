import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cozyoven.store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/account/",
          "/cart",
          "/checkout",
          "/payment-verify",
          "/order-success",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
