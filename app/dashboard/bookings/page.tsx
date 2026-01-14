"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import apiClient from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  stationId: string;
  station?: {
    id: string;
    name: string;
    location: string;
    power: number;
  };
  duration: number;
  durationMinutes: number;
  price: number;
  totalPrice: number;
  status: "pending" | "active" | "completed" | "cancelled";
  startTime: string;
  endTime: string | null;
  powerKw: number;
}

async function fetchBookings(): Promise<Booking[]> {
  try {
    const response = await apiClient.get("/bookings");
    return (response.data || []).map((booking: any) => {
      const statusMap: Record<string, string> = {
        PENDING: "pending",
        ACTIVE: "active",
        COMPLETED: "completed",
        CANCELLED: "cancelled",
      };
      const status = statusMap[booking.status] || booking.status.toLowerCase();
      
      const duration = booking.durationMinutes ? booking.durationMinutes / 60 : 0;
      
      return {
        id: booking.id,
        stationId: booking.stationId,
        duration: duration,
        durationMinutes: booking.durationMinutes || 0,
        price: booking.totalPrice || 0,
        totalPrice: booking.totalPrice || 0,
        status: status as "pending" | "active" | "completed" | "cancelled",
        startTime: booking.startTime,
        endTime: booking.endTime,
        powerKw: booking.powerKw || 0,
      };
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw error;
    }
    return [];
  }
}

export default function BookingsPage() {
  const t = useTranslations("bookings");
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    retry: false,
  });

  const statusConfig = {
    pending: { label: t("status.pending"), variant: "secondary" as const, color: "text-yellow-400" },
    active: { label: t("status.active"), variant: "default" as const, color: "text-primary" },
    completed: { label: t("status.completed"), variant: "outline" as const, color: "text-green-400" },
    cancelled: { label: t("status.cancelled"), variant: "destructive" as const, color: "text-destructive" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t("loading")}</div>
      </div>
    );
  }

  if (error && (error as any).response?.status !== 401) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("subtitle")}
          </p>
        </div>
        <Card className="border-destructive/20 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-destructive">
              {t("errorLoading")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("tryAgain")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("subtitle")}
          </p>
        </div>
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {t("noBookings")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("noBookingsDescription")}
            </p>
          </CardContent>
        </Card>
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
      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking, index) => {
          const statusInfo = statusConfig[booking.status];
          const isActive = booking.status === "active";
          const startDate = new Date(booking.startTime);
          const endDate = booking.endTime ? new Date(booking.endTime) : null;

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "border-primary/20 bg-card/50 backdrop-blur-sm transition-all",
                  isActive && "border-primary/40 shadow-lg shadow-primary/10"
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {booking.station?.name || `Station ${booking.stationId.slice(0, 8)}`}
                        {isActive && (
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.7, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="h-2 w-2 rounded-full bg-primary"
                          />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4" />
                        {booking.station?.location || "Location not available"}
                      </CardDescription>
                    </div>
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span>{t("power")}</span>
                      </div>
                      <p className="text-lg font-semibold">
                        {booking.powerKw || booking.station?.power || 0} kW
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{t("duration")}</span>
                      </div>
                      <p className="text-lg font-semibold">
                        {booking.duration} {booking.duration === 1 ? "h" : "h"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{t("startTime")}</span>
                      </div>
                      <p className="text-sm font-semibold">
                        {startDate.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {startDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{t("totalPrice")}</span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        ${booking.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="h-3 w-3 rounded-full bg-primary"
                        />
                        <div>
                          <p className="text-sm font-medium text-primary">
                            {t("chargingInProgress")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {endDate 
                              ? `${t("sessionEndsAt")} ${endDate.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`
                              : t("sessionInProgress")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

