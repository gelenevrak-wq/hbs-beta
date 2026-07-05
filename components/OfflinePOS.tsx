"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface OfflineOrder {
  id: string;
  storeSlug: string;
  items: any[];
  totalAmount: number;
  customerName: string;
  phone: string;
  timestamp: string;
}

export default function OfflinePOS() {
  const [isOffline, setIsOffline] = useState(false);
  const [syncedOrdersCount, setSyncedOrdersCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOffline(!online);
      
      if (online) {
        // Trigger background synchronization when back online
        syncOfflineOrders();
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    
    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const syncOfflineOrders = async () => {
    try {
      const queueStr = window.localStorage.getItem("hbs-offline-orders");
      if (!queueStr) return;

      const queue: OfflineOrder[] = JSON.parse(queueStr);
      if (!Array.isArray(queue) || queue.length === 0) return;

      console.log(`Clarity Sync: Found ${queue.length} offline orders to synchronize...`);
      
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      let successfulSyncs = 0;

      for (const order of queue) {
        // If Supabase is configured, sync to database
        if (isSupabaseConfigured) {
          const { error } = await supabase.from("orders").insert({
            id: order.id,
            company_code: order.storeSlug,
            customer_name: order.customerName,
            customer_phone: order.phone,
            total_price: order.totalAmount,
            status: "pending",
            created_at: order.timestamp,
            payment_status: "unpaid",
            notes: "Offline POS Synced"
          });
          if (error) {
            console.error("Failed to sync order to Supabase:", error);
            continue;
          }
        }
        successfulSyncs++;
      }

      if (successfulSyncs > 0) {
        // Clear successfully synced orders from localStorage
        const remaining = queue.slice(successfulSyncs);
        if (remaining.length > 0) {
          window.localStorage.setItem("hbs-offline-orders", JSON.stringify(remaining));
        } else {
          window.localStorage.removeItem("hbs-offline-orders");
        }
        
        setSyncedOrdersCount(successfulSyncs);
        setTimeout(() => setSyncedOrdersCount(0), 4000);
      }
    } catch (e) {
      console.error("Error during offline orders synchronization:", e);
    }
  };

  if (!isOffline && syncedOrdersCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm animate-bounce">
      {isOffline ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-xl flex items-center gap-3 text-amber-900 backdrop-blur-lg/80">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">İnternet Bağlantısı Yok</h4>
            <p className="text-[10px] font-bold text-amber-700 mt-0.5 leading-relaxed">
              HBS Çevrimdışı POS modu devrede. Yaptığınız satışlar yerel hafızaya kaydedilecek ve internet geldiğinde otomatik eşitlenecektir.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 shadow-xl flex items-center gap-3 text-emerald-900 backdrop-blur-lg/80">
          <span className="text-2xl">✓</span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">Bağlantı Kuruldu!</h4>
            <p className="text-[10px] font-bold text-emerald-700 mt-0.5 leading-relaxed">
              Çevrimdışı girilen {syncedOrdersCount} adet sipariş başarıyla veritabanına ve buluta senkronize edildi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
