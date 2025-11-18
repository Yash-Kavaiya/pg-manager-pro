import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, MessageSquare, Clock, AlertCircle, CheckCircle2, Server } from "lucide-react";
import { NotificationPreferences } from "@/types";
import { usePGContext } from "@/context/PGContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function NotificationSettings() {
  const { selectedPG } = usePGContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    emailConfigured: boolean;
    smsConfigured: boolean;
  } | null>(null);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    id: "1",
    pgId: selectedPG?.id || "pg1",
    emailEnabled: true,
    smsEnabled: true,
    daysBefore: 3,
    sendOverdueReminders: true,
    reminderTime: "09:00",
  });

  // Check server status on mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/config`);
      const data = await response.json();
      setServerStatus({
        online: true,
        emailConfigured: data.emailConfigured,
        smsConfigured: data.smsConfigured,
      });
    } catch (error) {
      setServerStatus({
        online: false,
        emailConfigured: false,
        smsConfigured: false,
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Settings saved",
        description: "Notification preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification preferences.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/notifications/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Test notification triggered",
          description: `Processed ${data.results.processed} payments. Sent ${data.results.sent} reminders.`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: serverStatus?.online
          ? "Failed to trigger test notification."
          : "Server is offline. Please start the backend server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Server Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              <CardTitle>Server Status</CardTitle>
            </div>
            <Badge variant={serverStatus?.online ? "default" : "destructive"}>
              {serverStatus?.online ? "Online" : "Offline"}
            </Badge>
          </div>
          <CardDescription>
            Backend notification service status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Email Service</span>
            </div>
            {serverStatus?.emailConfigured ? (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Configured
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Not Configured
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">SMS Service</span>
            </div>
            {serverStatus?.smsConfigured ? (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Configured
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Not Configured
              </Badge>
            )}
          </div>

          {!serverStatus?.online && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Server is offline.</strong> Start the backend server to enable automated reminders:
                <code className="block mt-2 p-2 bg-black/5 dark:bg-white/5 rounded text-xs">
                  cd server && npm install && npm run dev
                </code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Configure automated payment reminder settings for {selectedPG?.name || "your PG"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-enabled">Email Reminders</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Send payment reminders via email to tenants
              </p>
            </div>
            <Switch
              id="email-enabled"
              checked={preferences.emailEnabled}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, emailEnabled: checked })
              }
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sms-enabled">SMS Reminders</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Send payment reminders via SMS to tenants
              </p>
            </div>
            <Switch
              id="sms-enabled"
              checked={preferences.smsEnabled}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, smsEnabled: checked })
              }
            />
          </div>

          {/* Days Before Due */}
          <div className="space-y-2">
            <Label htmlFor="days-before">Days Before Due Date</Label>
            <Input
              id="days-before"
              type="number"
              min="1"
              max="30"
              value={preferences.daysBefore}
              onChange={(e) =>
                setPreferences({ ...preferences, daysBefore: parseInt(e.target.value) || 3 })
              }
              className="w-32"
            />
            <p className="text-sm text-muted-foreground">
              Send reminders {preferences.daysBefore} day(s) before payment is due
            </p>
          </div>

          {/* Overdue Reminders */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="overdue-enabled">Overdue Payment Reminders</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Send daily reminders for overdue payments
              </p>
            </div>
            <Switch
              id="overdue-enabled"
              checked={preferences.sendOverdueReminders}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, sendOverdueReminders: checked })
              }
            />
          </div>

          {/* Reminder Time */}
          <div className="space-y-2">
            <Label htmlFor="reminder-time">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Reminder Time
              </div>
            </Label>
            <Input
              id="reminder-time"
              type="time"
              value={preferences.reminderTime}
              onChange={(e) =>
                setPreferences({ ...preferences, reminderTime: e.target.value })
              }
              className="w-40"
            />
            <p className="text-sm text-muted-foreground">
              Daily check will run at {preferences.reminderTime || "09:00"} (configured in server)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
            <Button
              variant="outline"
              onClick={handleTestNotification}
              disabled={loading || !serverStatus?.online}
            >
              {loading ? "Testing..." : "Test Reminders Now"}
            </Button>
          </div>

          {/* Info Message */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>How it works:</strong> The system automatically checks for upcoming and overdue payments daily.
              When a payment is due within {preferences.daysBefore} days or is overdue, reminders are sent automatically
              via {preferences.emailEnabled && preferences.smsEnabled ? "email and SMS" : preferences.emailEnabled ? "email" : "SMS"}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
