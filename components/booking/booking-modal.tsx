"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, DollarSign, Clock } from "lucide-react";
import apiClient from "@/lib/axios";

interface ChargingStation {
  id: string;
  name: string;
  power: number;
  location: string;
  status: "available" | "occupied" | "maintenance";
  pricePerHour: number;
}

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  station: ChargingStation | null;
}

export function BookingModal({ open, onOpenChange, station }: BookingModalProps) {
  const [duration, setDuration] = useState(1);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: async (data: { stationId: string; duration: number; powerKw: number }) => {
      // API expects startTime (ISO string) and powerKw, not duration
      const startTime = new Date().toISOString();
      const response = await apiClient.post("/bookings", {
        stationId: data.stationId,
        startTime: startTime,
        powerKw: data.powerKw,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onOpenChange(false);
      setDuration(1);
      setError("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to create booking");
    },
  });

  useEffect(() => {
    if (open && station) {
      setDuration(1);
      setError("");
    }
  }, [open, station]);

  if (!station) return null;

  const estimatedPrice = duration * (station.pricePerHour ?? 0);
  const estimatedEnergy = (duration * (station.power ?? 0)).toFixed(1);

  const handleBooking = () => {
    if (duration < 1 || duration > 24) {
      setError("Duration must be between 1 and 24 hours");
      return;
    }
    setError("");
    bookingMutation.mutate({
      stationId: station.id,
      duration,
      powerKw: station.power,
    });
  };

  const handleDurationChange = (value: string) => {
    const numValue = Number(value);
    if (numValue >= 1 && numValue <= 24) {
      setDuration(numValue);
      setError("");
    } else if (value === "") {
      setDuration(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Book Charging Station
          </DialogTitle>
          <DialogDescription>
            Reserve {station.name} for your charging session
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="station-name">Station</Label>
            <Input
              id="station-name"
              value={station.name}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="power">Power</Label>
            <Input
              id="power"
              value={`${station.power ?? 0} kW`}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={station.location}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="24"
              step="0.5"
              value={duration || ""}
              onChange={(e) => handleDurationChange(e.target.value)}
              placeholder="Enter duration"
            />
            <p className="text-xs text-muted-foreground">
              Minimum: 1 hour | Maximum: 24 hours
            </p>
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            {duration > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {duration} {duration === 1 ? "hour" : "hours"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span>Estimated Energy</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {estimatedEnergy} kWh
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-primary/20 pt-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Estimated Price</span>
                  </div>
                  <motion.span
                    key={estimatedPrice}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-primary"
                  >
                    ${estimatedPrice.toFixed(2)}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={bookingMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleBooking}
              disabled={
                bookingMutation.isPending ||
                station.status !== "available" ||
                duration < 1 ||
                duration > 24
              }
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

