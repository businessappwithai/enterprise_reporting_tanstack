"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Globe, Lock, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceId: string;
  resourceType: "dashboard" | "report" | "chart";
  isPublic: boolean;
  onTogglePublic: (isPublic: boolean) => void;
}

export function ShareDialog({
  open,
  onOpenChange,
  resourceId,
  resourceType,
  isPublic,
  onTogglePublic,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${resourceType}/${resourceId}`
      : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Share link copied to clipboard");
    } catch (_err) {
      toast.error("Failed to copy link");
    }
  };

  const togglePublicMutation = useMutation({
    mutationFn: async (newState: boolean) => {
      const response = await fetch(`/api/${resourceType}s/${resourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: newState }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resourceType, resourceId] });
      toast.success(
        isPublic
          ? `This ${resourceType} is now private. Only signed-in users with access can open the link.`
          : `This ${resourceType} is now public. Anyone with the link can see its public page.`
      );
      onTogglePublic(!isPublic);
    },
    onError: () => {
      toast.error("Failed to update visibility");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
          </DialogTitle>
          <DialogDescription>
            {isPublic
              ? `This ${resourceType} is public. Anyone with the link can see its public page; signed-in users go straight to the full ${resourceType}.`
              : `Send the link to colleagues: anyone signed in whose role can view ${resourceType}s will open it.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Public Toggle */}
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-0.5">
              <Label className="text-base">Make Public</Label>
              <p className="text-tremor-default text-tremor-content">
                {isPublic
                  ? "Visitors who are not signed in can see a limited public page."
                  : "Off: people must sign in, and their role must allow viewing."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="h-5 w-5 text-emerald-600" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              <Switch
                checked={isPublic}
                onCheckedChange={(checked) => togglePublicMutation.mutate(checked)}
                disabled={togglePublicMutation.isPending}
              />
            </div>
          </div>

          {/* Share Link — shown whether or not it is public: sharing with the people who use
              the system is the main case, and it needs no public switch. */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Share Link</Label>
            <div className="flex space-x-2">
              <Input id="share-url" value={shareUrl} readOnly className="flex-1" />
              <Button
                size="icon"
                variant={copied ? "default" : "outline"}
                onClick={copyToClipboard}
                disabled={togglePublicMutation.isPending}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-tremor-label text-tremor-content">
              {isPublic
                ? "Anyone can open this; signed-in users go straight to the full page."
                : "Colleagues who are signed in open it directly; anyone else is asked to sign in first."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
