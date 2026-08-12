/**
 * Zod Validation Schemas for Dashboard Forms
 */

import { z } from 'zod';

// ============ Article Validation ============

export const authorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Author name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  role: z.enum(['admin', 'editor', 'contributor']).optional(),
});

export const createNewsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  subtitle: z.string().optional(),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  excerpt: z.string().optional(),
  featured_image: z.string().url('Invalid image URL').optional(),
  image_caption: z.string().optional(),
  video_url: z.string().url('Invalid video URL').optional().or(z.literal('')),
  authors: z.array(authorSchema).min(1, 'At least one author is required'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
  seoKeywords: z.array(z.string()).optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

// ============ Advertisement Validation ============

export const createAdvertisementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL'),
  link: z.string().url('Invalid link URL').optional(),
  position: z.enum(['banner', 'sidebar', 'footer', 'inline']),
  isActive: z.boolean().default(true),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date').optional(),
});

export const updateAdvertisementSchema = createAdvertisementSchema.partial();

// ============ File Upload Validation ============

export const uploadFileSchema = z.object({
  file: z.instanceof(File, { message: 'Must be a file' })
    .refine(file => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/csv'].includes(file.type),
      'Invalid file type'
    ),
  name: z.string().optional(),
});

// ============ Settings Validation ============

export const dashboardSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().optional(),
  siteUrl: z.string().url('Invalid site URL'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  socialLinks: z.object({
    facebook: z.string().url('Invalid Facebook URL').optional().nullable(),
    twitter: z.string().url('Invalid Twitter URL').optional().nullable(),
    instagram: z.string().url('Invalid Instagram URL').optional().nullable(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional().nullable(),
  }).optional().nullable(),
  maintenanceMode: z.boolean().default(false),
  enableComments: z.boolean().default(true),
  postsPerPage: z.number().int().min(1).max(100).default(10),
  timezone: z.string().default('UTC'),
});

// ============ Type Exports ============

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type CreateAdvertisementInput = z.infer<typeof createAdvertisementSchema>;
export type UpdateAdvertisementInput = z.infer<typeof updateAdvertisementSchema>;
export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type DashboardSettingsInput = z.infer<typeof dashboardSettingsSchema>;

// ============ Helper Functions ============

export async function validateNewsArticle(data: unknown) {
  return createNewsSchema.parseAsync(data);
}

export async function validateAdvertisement(data: unknown) {
  return createAdvertisementSchema.parseAsync(data);
}

export async function validateFileUpload(data: unknown) {
  return uploadFileSchema.parseAsync(data);
}

export async function validateSettings(data: unknown) {
  return dashboardSettingsSchema.parseAsync(data);
}
