"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import apiClient from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, MapPin } from "lucide-react";
import { BookingModal } from "@/components/booking/booking-modal";

interface ChargingStation {
  id: string;
  name: string;
  power: number;
  location: string;
  status: "available" | "occupied" | "maintenance";
  pricePerHour: number;
}

async function fetchStations(): Promise<ChargingStation[]> {
  const response = await apiClient.get("/stations");
  return (response.data || []).map((station: any) => {
    const basePricePerKw = 0.5;
    const powerKw = station.powerKw ?? 0;
    const pricePerHour = powerKw * basePricePerKw;
    
    const status = station.isAvailable 
      ? "available" 
      : "occupied";
    
    return {
      id: station.id,
      name: station.name,
      power: powerKw,
      location: station.location,
      status: status,
      pricePerHour: pricePerHour,
    };
  });
}

export default function DashboardPage() {
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("dashboard");

  const { data: stations, isLoading } = useQuery({
    queryKey: ["stations"],
    queryFn: fetchStations,
  });

  const handleBookNow = (station: ChargingStation) => {
    setSelectedStation(station);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t("loadingStations")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations?.map((station) => (
          <Card
            key={station.id}
            className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{station.name}</CardTitle>
                <Badge
                  variant={
                    station.status === "available"
                      ? "default"
                      : station.status === "occupied"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {t(`status.${station.status}`)}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {station.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {station.power ?? 0} kW
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t("price")}</p>
                  <p className="text-lg font-semibold">
                    ${(station.pricePerHour ?? 0).toFixed(2)}/hr
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                disabled={station.status !== "available"}
                onClick={() => handleBookNow(station)}
              >
                {t("bookNow")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <BookingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        station={selectedStation}
      />
    </div>
  );
}

