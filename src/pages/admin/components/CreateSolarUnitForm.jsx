import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCreateSolarUnitMutation } from "@/lib/redux/query";
import { Country, City } from "country-state-city";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  serialNumber: z.string().min(1, { message: "Serial number is required" }),
  installationDate: z
    .string()
    .min(1, { message: "Installation date is required" }),
  capacity: z
    .number()
    .positive({ message: "Capacity must be a positive number" }),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"], {
    message: "Please select a valid status",
  }),
  // Location fields are hidden but required for the backend
  location: z.object({
    latitude: z.number({ required_error: "Location is required" }),
    longitude: z.number({ required_error: "Location is required" }),
  }),
});

export function CreateSolarUnitForm() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const cities = useMemo(() => {
    if (!selectedCountry) return [];
    return City.getCitiesOfCountry(selectedCountry);
  }, [selectedCountry]);

  // Transform data for Select options
  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.isoCode, label: c.name })),
    [countries]
  );
  const cityOptions = useMemo(
    () => cities.map((c) => ({ value: c.name, label: c.name })),
    [cities]
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNumber: "",
      installationDate: "",
      capacity: 5000,
      status: "ACTIVE",
      location: { latitude: 0, longitude: 0 }, // Default to 0,0 temporarily
    },
  });

  const [createSolarUnit, { isLoading: isCreatingSolarUnit }] =
    useCreateSolarUnitMutation();

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedCity("");
  };

  // Handle Location Selection
  const handleCityChange = (cityCode) => {
    setSelectedCity(cityCode);
    const cityData = cities.find((c) => c.name === cityCode);
    if (cityData) {
      form.setValue("location.latitude", parseFloat(cityData.latitude));
      form.setValue("location.longitude", parseFloat(cityData.longitude));
    }
  };

  async function onSubmit(values) {
    try {
      const countryData = countries.find((c) => c.isoCode === selectedCountry);
      const countryName = countryData ? countryData.name : "";

      // Ensure we send valid numbers
      const payload = {
        ...values,
        capacity: Number(values.capacity),
        city: selectedCity,
        country: countryName,
        location: {
          latitude: Number(values.location.latitude),
          longitude: Number(values.location.longitude),
        },
      };
      await createSolarUnit(payload).unwrap();
      toast.success("Solar Unit created successfully");
      form.reset();
      setSelectedCountry("");
      setSelectedCity("");
      navigate("/admin/solar-units");
    } catch (error) {
      console.error("Failed to create solar unit", error);
      toast.error(error.data?.message || "Failed to create solar unit");
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-muted/40">
      <CardHeader className="space-y-1 pb-6 border-b border-border/50 bg-slate-50/30">
        <CardTitle className="mt-4 text-2xl font-bold tracking-tight text-primary">
          Create Solar Unit
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Enter the implementation details for the new solar unit.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 mt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Column 1: Technical Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b">
                  <h3 className="font-semibold text-lg">
                    Technical Specifications
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-muted text-muted-foreground"
                          placeholder="SerialNumber-123"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for the solar panel array.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (kW)</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11"
                          type="number"
                          placeholder="5000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="MAINTENANCE">
                              Maintenance
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Column 2: Location & Date */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b">
                  <h3 className="font-semibold text-lg">
                    Installation & Location
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="installationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Installation Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-11"
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location Selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel className="text-base">Country</FormLabel>
                    <SearchableSelect
                      options={countryOptions}
                      value={selectedCountry}
                      onValueChange={handleCountryChange}
                      placeholder="Select Country"
                    />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-base">City</FormLabel>
                    <SearchableSelect
                      options={cityOptions}
                      value={selectedCity}
                      onValueChange={handleCityChange}
                      disabled={!selectedCountry}
                      placeholder="Select City"
                    />
                  </FormItem>
                </div>
                {form.formState.errors.location && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    Location is required
                  </p>
                )}

                {/* Display Coords for confirmation */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border/50 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Coordinates (Auto-filled)
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Latitude
                      </span>
                      <span className="font-mono text-sm font-medium">
                        {form.watch("location.latitude") || "0.00"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Longitude
                      </span>
                      <span className="font-mono text-sm font-medium">
                        {form.watch("location.longitude") || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t mt-8 mb-4">
              <Button
                type="submit"
                size="lg"
                className="px-8 h-11 text-base shadow-md"
                disabled={isCreatingSolarUnit}
              >
                {isCreatingSolarUnit ? "Creating..." : "Create Solar Unit"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
