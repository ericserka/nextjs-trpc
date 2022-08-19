import {
  createPostSchema,
  getManyPostsSchema,
  singlePostSchema,
  updatePostSchema,
} from '@/schema/post.schema'
import { PERPAGE } from '@/src/constants'
import { throwGenericError } from '@/utils/errors'
import { checkDBConn, updateOrDeleteNonexistentRecord } from '@/utils/prisma'
import { NotFoundError } from '@prisma/client/runtime'
import * as trpcServer from '@trpc/server'
import { createRouter } from '../createRouter'

export const postRouter = createRouter()
  .mutation('create', {
    input: createPostSchema,
    resolve: async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new trpcServer.TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot create a post while logged out',
        })
      }
      try {
        return await ctx.prisma.post.create({
          data: {
            ...input,
            user: {
              connect: {
                id: ctx.user.id,
              },
            },
          },
        })
      } catch (e) {
        checkDBConn(e)
        throwGenericError()
      }
    },
  })
  .query('get-all-paginated', {
    input: getManyPostsSchema,
    resolve: async ({ ctx, input }) => {
      try {
        const items = await ctx.prisma.post.findMany({
          take: PERPAGE + 1, // get an extra item at the end which we'll use as next cursor
          cursor: input.cursor ? { id: input.cursor } : undefined,
          where: {
            user: {
              id: ctx?.user?.id,
            },
          },
        })
        let nextCursor: typeof input.cursor | undefined = undefined
        if (items.length > PERPAGE) {
          const nextItem = items.pop()
          nextCursor = nextItem!.id
        }

        return {
          items,
          nextCursor,
        }
      } catch (e) {
        checkDBConn(e)
        throwGenericError()
      }
    },
  })
  .query('get-by-id', {
    input: singlePostSchema,
    resolve: async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.findUniqueOrThrow({
          where: {
            id: input.postId,
          },
        })
      } catch (e) {
        checkDBConn(e)
        if (e instanceof NotFoundError) {
          throw new trpcServer.TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          })
        }
        throwGenericError()
      }
    },
  })
  .mutation('delete', {
    input: singlePostSchema,
    resolve: async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.delete({
          where: {
            id: input.postId,
          },
        })
      } catch (e) {
        checkDBConn(e)
        updateOrDeleteNonexistentRecord(e, 'Post')
        throwGenericError()
      }
    },
  })
  .mutation('update', {
    input: updatePostSchema,
    resolve: async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            title: input.title,
            body: input.body,
          },
        })
      } catch (e) {
        checkDBConn(e)
        updateOrDeleteNonexistentRecord(e, 'Post')
        throwGenericError()
      }
    },
  })
