"use client";

/**
 * Offline indicator component.
 * Shows whether the app is online. There is no offline data cache: datasets are produced for the
 * signed-in user at load time and are not kept in the browser (see lib/datasets/purge-cache.ts).
 */

import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { isFeatureEnabled } from "@/lib/feature-flags";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isFeatureEnabled("offlineEnabled")) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/30 border-b text-xs">
      <div className="flex items-center gap-1.5">
        {isOnline ? (
          <>
            <Wifi className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-amber-600 dark:text-amber-400">Offline</span>
          </>
        )}
      </div>
      {!isOnline && (
        <Badge variant="outline" className="text-amber-600 border-amber-600">
          Datasets cannot be loaded while offline
        </Badge>
      )}
    </div>
  );
}
