import { demoNotifications } from "./mock-data";
import type { DemoNotification } from "@/lib/orders/types";

/**
 * Notification data boundary. Replace this local repository with the
 * Notification Service client when that service is available.
 */
export function getNotifications(): DemoNotification[] {
  return demoNotifications;
}
