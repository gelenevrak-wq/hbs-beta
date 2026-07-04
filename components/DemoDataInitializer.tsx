"use client";

import { useEffect } from "react";
import { OZGUR_MOTOR_STORE, OZGUR_MOTOR_STAFF, generateOzgurMotorProducts } from "@/lib/demoData";

export default function DemoDataInitializer() {
  useEffect(() => {
    try {
      // 1. Initialize Stores
      const storesStr = window.localStorage.getItem("hbs-registered-stores");
      let loadedStores = storesStr ? JSON.parse(storesStr) : [];
      const hasOzgur = loadedStores.some((s: any) => s.code === "ozgur-motor");
      if (!hasOzgur) {
        loadedStores.push(OZGUR_MOTOR_STORE);
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify(loadedStores));
      }

      // 2. Initialize Staff
      const staffStr = window.localStorage.getItem("hbs-store-users");
      let loadedStaff = staffStr ? JSON.parse(staffStr) : [];
      const hasStaff = loadedStaff.some((st: any) => st.username === "OZGURMOTOR");
      if (!hasStaff) {
        loadedStaff.push(OZGUR_MOTOR_STAFF);
        window.localStorage.setItem("hbs-store-users", JSON.stringify(loadedStaff));
      }

      // 3. Initialize Products (programmatically generated 400 parts)
      const prodStr = window.localStorage.getItem("hbs-store-products");
      let loadedProds = prodStr ? JSON.parse(prodStr) : [];
      const ozgurProdsCount = loadedProds.filter((p: any) => 
        p.id.startsWith("prod-toyota-") || 
        p.id.startsWith("prod-mercedes-") || 
        p.id.startsWith("prod-bmw-")
      ).length;

      if (ozgurProdsCount < 400) {
        // Clean out any old mock parts first to avoid duplicates
        const filteredProds = loadedProds.filter((p: any) => 
          !p.id.startsWith("prod-toyota-") && 
          !p.id.startsWith("prod-mercedes-") && 
          !p.id.startsWith("prod-bmw-") && 
          !p.id.startsWith("prod-opel-") && 
          !p.id.startsWith("prod-ford-") && 
          !p.id.startsWith("prod-subaru-") && 
          !p.id.startsWith("prod-honda-") && 
          !p.id.startsWith("prod-hyundai-")
        );
        const ozgurProducts = generateOzgurMotorProducts();
        const combined = [...filteredProds, ...ozgurProducts];
        window.localStorage.setItem("hbs-store-products", JSON.stringify(combined));
      }
    } catch (e) {
      console.error("DemoDataInitializer error", e);
    }
  }, []);

  return null;
}
