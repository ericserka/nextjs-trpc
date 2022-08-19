import * as z from 'zod'

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(256, 'Title must be a maximum of 256 characters'),
  body: z.string().min(10, 'The minimum characters for the body is 10'),
})

export type CreatePostInput = z.TypeOf<typeof createPostSchema>

export const singlePostSchema = z.object({
  postId: z.string().uuid(),
})

export type SinglePostInput = z.TypeOf<typeof singlePostSchema>

export const getManyPostsSchema = z.object({
  cursor: z.string().nullish(),
})

export type GetManyPostsInput = z.TypeOf<typeof getManyPostsSchema>

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(256, 'Title must be a maximum of 256 characters')
    .optional(),
  body: z
    .string()
    .min(10, 'The minimum characters for the body is 10')
    .optional(),
  postId: z.string().uuid(),
})

export type UpdatePostInput = z.TypeOf<typeof updatePostSchema>
