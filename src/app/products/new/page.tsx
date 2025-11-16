'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateProductListingDescription } from '@/ai/flows/generate-product-listing-description';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  category: z.enum(['Clothes', 'Gadgets', 'Books', 'Furniture', 'Other'], {
    required_error: 'You need to select a category.',
  }),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair'], {
    required_error: 'You need to select a condition.',
  }),
  imageUrl: z.string().url('Must be a valid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      category: undefined,
      condition: undefined,
      imageUrl: '',
    },
  });

  const handleGenerateDescription = async () => {
    if (!aiPrompt) {
      toast({
        title: 'Prompt is empty',
        description: 'Please enter a prompt to generate a description.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateProductListingDescription({
        prompt: aiPrompt,
      });
      form.setValue('description', result.description, { shouldValidate: true });
      toast({
        title: 'Description Generated!',
        description: 'The AI-generated description has been added.',
      });
    } catch (error) {
      console.error('AI generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: 'There was an error generating the description.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  function onSubmit(data: ProductFormValues) {
    console.log(data);
    toast({
      title: 'Product Listed!',
      description: `${data.name} has been successfully listed for sale.`,
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>List a New Product</CardTitle>
          <CardDescription>
            Fill out the details below to sell your item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Vintage University Hoodie"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>AI Description Generator</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Slightly used vintage hoodie from the 90s"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product in detail..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            'Clothes',
                            'Gadgets',
                            'Books',
                            'Furniture',
                            'Other',
                          ].map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Condition</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        {['New', 'Like New', 'Good', 'Fair'].map((cond) => (
                          <FormItem
                            key={cond}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={cond} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {cond}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg">
                List Product
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
