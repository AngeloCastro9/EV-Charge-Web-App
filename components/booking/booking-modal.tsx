"use client";

import { useState } from "react";
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
import { Zap } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  if (!station) return null;

  const estimatedPrice = (duration * station.pricePerHour).toFixed(2);

  const handleBooking = async () => {
    setLoading(true);
    try {
      // TODO: Implement booking API call in Phase 5
      console.log("Booking:", { stationId: station.id, duration });
      setTimeout(() => {
        setLoading(false);
        onOpenChange(false);
        setDuration(1);
      }, 1000);
    } catch (error) {
      setLoading(false);
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
              value={`${station.power} kW`}
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
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Estimated Price
              </span>
              <span className="text-2xl font-bold text-primary">
                ${estimatedPrice}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleBooking}
              disabled={loading || station.status !== "available"}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

