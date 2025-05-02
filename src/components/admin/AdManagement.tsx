
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns";

const adFormSchema = z.object({
  title: z.string().min(2, {
    message: "Ad title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageUrl: z.string().url({ message: "Invalid URL." }),
  targetUrl: z.string().url({ message: "Invalid URL." }),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().default(false),
  adCategory: z.enum(['movie', 'series', 'kannywood', 'music']),
  devices: z.array(z.string()).optional(),
})

const AdManagement = () => {
  const { toast } = useToast();
  const [ads, setAds] = useState([
    {
      id: "1",
      title: "New Movie Ad",
      description: "Check out our latest movie!",
      imageUrl: "https://via.placeholder.com/150",
      targetUrl: "https://example.com/movie",
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
      adCategory: 'movie',
      devices: ['desktop', 'mobile'],
    },
    {
      id: "2",
      title: "Series Promotion",
      description: "Don't miss the new series episode.",
      imageUrl: "https://via.placeholder.com/150",
      targetUrl: "https://example.com/series",
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      adCategory: 'series',
      devices: ['mobile'],
    },
  ]);

  const adForm = useForm<z.infer<typeof adFormSchema>>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      targetUrl: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      adCategory: 'movie',
      devices: [],
    },
  })

  const onSubmit = (values: z.infer<typeof adFormSchema>) => {
    // Here you would handle the actual submission of the form data
    // For example, sending it to an API.
    console.log(values)
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  const deviceOptions = [
    { label: "Desktop", value: "desktop" },
    { label: "Mobile", value: "mobile" },
    { label: "Tablet", value: "tablet" },
  ]

  const handleDeleteAd = (adId: string) => {
    // Delete the ad logic here
    console.log("Deleting ad:", adId);
    toast({
      title: "Ad deleted",
      description: "The ad has been successfully deleted.",
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Ad Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add Ad</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a new advertisement</DialogTitle>
              <DialogDescription>
                Create a new ad to promote content on KannyFlix.
              </DialogDescription>
            </DialogHeader>
            <Form {...adForm}>
              <form onSubmit={adForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={adForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Ad Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={adForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ad Description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={adForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={adForm.control}
                  name="targetUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Target URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-2">
                  <FormField
                    control={adForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : new Date();
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : new Date();
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={adForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Enable or disable the ad.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={adForm.control}
                  name="adCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="series">Series</SelectItem>
                          <SelectItem value="kannywood">Kannywood</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={adForm.control}
                  name="devices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devices</FormLabel>
                      <div className="flex flex-col space-y-2">
                        {deviceOptions.map((device) => (
                          <div key={device.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={device.value}
                              checked={field.value?.includes(device.value)}
                              onCheckedChange={(checked) => {
                                return checked ? field.onChange([...field.value || [], device.value]) : field.onChange(field.value?.filter((value) => value !== device.value))
                              }}
                            />
                            <label
                              htmlFor={device.value}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {device.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of your advertisements.</TableCaption>
        <TableHead>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {ads.map((ad) => (
            <TableRow key={ad.id}>
              <TableCell>
                <img src={ad.imageUrl} alt={ad.title} className="w-24 h-16 object-cover rounded" />
              </TableCell>
              <TableCell className="font-medium">{ad.title}</TableCell>
              <TableCell>{ad.description}</TableCell>
              <TableCell>{ad.adCategory}</TableCell>
              <TableCell>{ad.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdManagement;
