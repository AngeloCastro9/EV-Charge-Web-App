"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, MapPin } from "lucide-react";

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
  return response.data;
}

export default function DashboardPage() {
  const { data: stations, isLoading } = useQuery({
    queryKey: ["stations"],
    queryFn: fetchStations,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading stations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Charging Stations</h1>
        <p className="text-muted-foreground mt-2">
          Find and book available charging stations
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
                  {station.status}
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
                  <span className="text-2xl font-bold">{station.power} kW</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold">
                    ${station.pricePerHour.toFixed(2)}/hr
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                disabled={station.status !== "available"}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

