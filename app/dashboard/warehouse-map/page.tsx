import DashboardLayout from "@/components/layout/DashboardLayout";
import WarehouseMapBuilder from "@/components/warehouse-map/WarehouseMapBuilder";

export default function WarehouseMapPage() {
  return (
    <DashboardLayout activeMenu="Dijital Depo İkizi">
      <WarehouseMapBuilder />
    </DashboardLayout>
  );
}
