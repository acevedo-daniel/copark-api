-- Hardening: indexes and data integrity checks

-- Performance indexes
CREATE INDEX IF NOT EXISTS "Review_parkingId_idx" ON "Review"("parkingId");
CREATE INDEX IF NOT EXISTS "Booking_vehicleId_status_idx" ON "Booking"("vehicleId", "status");

-- Domain integrity: one active booking (CONFIRMED) per vehicle
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_vehicleId_confirmed_unique"
ON "Booking"("vehicleId")
WHERE "status" = 'CONFIRMED';

-- Data integrity checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Review_rating_range_check'
  ) THEN
    ALTER TABLE "Review"
      ADD CONSTRAINT "Review_rating_range_check"
      CHECK ("rating" BETWEEN 1 AND 5);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Parking_price_positive_check'
  ) THEN
    ALTER TABLE "Parking"
      ADD CONSTRAINT "Parking_price_positive_check"
      CHECK ("pricePerHour" > 0);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Parking_total_spaces_positive_check'
  ) THEN
    ALTER TABLE "Parking"
      ADD CONSTRAINT "Parking_total_spaces_positive_check"
      CHECK ("totalSpaces" > 0);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Parking_lat_range_check'
  ) THEN
    ALTER TABLE "Parking"
      ADD CONSTRAINT "Parking_lat_range_check"
      CHECK ("lat" BETWEEN -90 AND 90);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Parking_lng_range_check'
  ) THEN
    ALTER TABLE "Parking"
      ADD CONSTRAINT "Parking_lng_range_check"
      CHECK ("lng" BETWEEN -180 AND 180);
  END IF;
END
$$;
