"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveProduct } from "@/app/actions/admin";
import { toast } from "sonner";

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  stock: number;
  categorySlug: string;
  featured: boolean;
  published: boolean;
}

export function ProductForm({
  categories,
  initialValues,
  isEdit,
}: {
  categories: { slug: string; name: string }[];
  initialValues: ProductFormValues;
  isEdit: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [values, setValues] = React.useState<ProductFormValues>(initialValues);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveProduct(
        {
          name: values.name,
          slug: values.slug || values.name.toLowerCase().replace(/\s+/g, "-"),
          description: values.description,
          price: values.price,
          compareAtPrice: values.compareAtPrice,
          images: values.images.filter((u) => u.trim()),
          stock: values.stock,
          categorySlug: values.categorySlug,
          featured: values.featured,
          published: values.published,
        },
        values.id
      );
      if (result.ok) {
        toast.success(isEdit ? "Product updated" : "Product created");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
      <div className="space-y-6 rounded-xl border p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Product name</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              required
              className="mt-1.5"
              placeholder="Wireless Headphones"
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={values.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="mt-1.5"
              placeholder="auto-generated from name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            rows={6}
            className="mt-1.5"
            placeholder="Product description..."
          />
        </div>

        <div>
          <Label htmlFor="images">Image URLs (one per line)</Label>
          <Textarea
            id="images"
            value={values.images.join("\n")}
            onChange={(e) => set("images", e.target.value.split("\n"))}
            rows={4}
            className="mt-1.5"
            placeholder={"https://images.unsplash.com/...\nhttps://images.unsplash.com/..."}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Pricing & stock</h2>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="price">Price (cents)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={values.price}
                onChange={(e) => set("price", Number(e.target.value))}
                required
                className="mt-1.5"
                placeholder="12500 = $125.00"
              />
            </div>
            <div>
              <Label htmlFor="compareAtPrice">Compare-at price (cents)</Label>
              <Input
                id="compareAtPrice"
                type="number"
                min={0}
                value={values.compareAtPrice ?? ""}
                onChange={(e) =>
                  set("compareAtPrice", e.target.value ? Number(e.target.value) : null)
                }
                className="mt-1.5"
                placeholder="Optional — shows sale strikethrough"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={values.stock}
                onChange={(e) => set("stock", Number(e.target.value))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={values.categorySlug} onValueChange={(v) => set("categorySlug", v)}>
                <SelectTrigger id="category" className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Visibility</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured">Featured</Label>
                <p className="text-xs text-muted-foreground">Show on the home page carousel</p>
              </div>
              <Switch id="featured" checked={values.featured} onCheckedChange={(v) => set("featured", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="published">Published</Label>
                <p className="text-xs text-muted-foreground">Visible in the store</p>
              </div>
              <Switch id="published" checked={values.published} onCheckedChange={(v) => set("published", v)} />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}