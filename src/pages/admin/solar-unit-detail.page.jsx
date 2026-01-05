import { toast } from "sonner";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Settings2,
  Trash2,
  Zap,
  Battery,
  CalendarDays,
  Server,
  User,
  Activity,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  useGetSolarUnitByIdQuery,
  useGetAllUsersQuery,
  useDeleteSolarUnitMutation,
} from "@/lib/redux/query";

export default function SolarUnitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: solarUnit,
    isLoading: isLoadingUnit,
    isError: isErrorUnit,
    error: errorUnit,
  } = useGetSolarUnitByIdQuery(id);

  const { data: users } = useGetAllUsersQuery();
  const [deleteSolarUnit] = useDeleteSolarUnitMutation();

  if (isLoadingUnit) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isErrorUnit) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-medium">Error loading solar unit</p>
        <p className="text-muted-foreground text-sm">{errorUnit.message}</p>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/solar-units")}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const handleEdit = () => navigate(`/admin/solar-units/${solarUnit._id}/edit`);

  const handleDelete = async () => {
    try {
      await deleteSolarUnit(solarUnit._id).unwrap();
      toast.success("Solar unit deleted successfully");
      navigate("/admin/solar-units");
    } catch (err) {
      toast.error(
        "Failed to delete solar unit: " + (err.data?.message || err.message)
      );
      console.error("Delete error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "MAINTENANCE":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const assignedUser = users?.find((u) => u._id === solarUnit.userId);

  const userName = assignedUser
    ? [assignedUser.firstName, assignedUser.lastName].filter(Boolean).join(" ")
    : "Unknown User";

  const userInitials = assignedUser
    ? `${assignedUser.firstName?.[0] || ""}${assignedUser.lastName?.[0] || ""}`
    : "?";

  return (
    <div className="container mx-auto py-8 px-6 max-w-7xl space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <Button
            variant="ghost"
            className="pl-2 text-muted-foreground hover:text-primary hover:bg-primary/10 -ml-2 transition-colors"
            onClick={() => navigate("/admin/solar-units")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Solar Units
          </Button>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {solarUnit.serialNumber}
              </h1>
              <Badge
                variant="outline"
                className={`font-mono px-3 py-1 text-xs font-semibold ${getStatusColor(
                  solarUnit.status
                )}`}
              >
                {solarUnit.status}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-lg">
              System ID:{" "}
              <span className="font-mono text-xs">{solarUnit._id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="h-9 shadow-sm"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Edit Configuration
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="h-9 shadow-sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  solar unit <strong>{solarUnit.serialNumber}</strong> and
                  remove all associated data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Unit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Separator />

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Capacity
            </CardTitle>
            <Zap className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold tracking-tight">
              {(solarUnit.capacity / 1000).toFixed(1)} kW
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Maximum power output
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Installation Date
            </CardTitle>
            <CalendarDays className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold tracking-tight">
              {format(new Date(solarUnit.installationDate), "MMM d, yyyy")}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              System age:{" "}
              {Math.floor(
                (new Date() - new Date(solarUnit.installationDate)) /
                  (1000 * 60 * 60 * 24 * 365.25)
              )}{" "}
              years
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Health
            </CardTitle>
            <Activity
              className={`h-5 w-5 ${
                solarUnit.status === "ACTIVE"
                  ? "text-emerald-500"
                  : "text-slate-500"
              }`}
            />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold tracking-tight capitalize">
              {solarUnit.status.toLowerCase()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {solarUnit.status === "ACTIVE" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
              <p className="text-sm text-muted-foreground">
                {solarUnit.status === "ACTIVE"
                  ? "All systems optimal"
                  : "Action required"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Technical Details */}
        <Card className="shadow-sm">
          <CardHeader className="px-8 pt-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Technical Specifications
                </CardTitle>
                <CardDescription>
                  Hardware and configuration details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">
                  Serial Number
                </p>
                <div className="font-mono bg-muted/50 px-3 py-1.5 rounded-md w-fit text-foreground">
                  {solarUnit.serialNumber}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">Model Type</p>
                <p className="font-medium text-foreground text-base">
                  Voltaris X-Series
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">
                  Firmware Version
                </p>
                <p className="font-medium text-foreground text-base">v2.4.0</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">
                  Grid Connection
                </p>
                <p className="font-medium text-foreground text-base">
                  Three-Phase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ownership & Location */}
        <Card className="shadow-sm">
          <CardHeader className="px-8 pt-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Ownership Details</CardTitle>
                <CardDescription>
                  Assigned user and location info
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-8">
            <div className="flex items-start gap-5">
              <Avatar className="w-14 h-14 border-2 border-background shadow-sm">
                {assignedUser?.imageUrl && (
                  <AvatarImage src={assignedUser.imageUrl} alt={userName} />
                )}
                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned To
                </p>
                {solarUnit.userId ? (
                  <>
                    <p className="text-lg font-semibold text-foreground">
                      {userName}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground bg-muted/30 py-0.5 rounded w-fit mt-1">
                      ID: {solarUnit.userId}
                    </p>
                  </>
                ) : (
                  <p className="text-base text-muted-foreground italic">
                    No user assigned
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="p-5 rounded-lg bg-orange-50 border border-orange-100 flex gap-4 items-start">
              <Battery className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900">
                  Maintenance Schedule
                </p>
                <p className="text-sm text-orange-700 mt-1 leading-relaxed">
                  Next scheduled maintenance is in{" "}
                  <span className="font-bold">45 days</span>. Please ensure the
                  unit is accessible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
