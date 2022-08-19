import { CreatePostInput, createPostSchema } from '@/schema/post.schema'
import { trpc } from '@/utils/trpc'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CreatePostPage() {
  const router = useRouter()
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  })
  const { mutate, isLoading } = trpc.useMutation(['posts.create'], {
    onSuccess: (data) => {
      router.push(`/posts/${data?.id}`)
    },
    onError: (error: any) => {
      alert(error.message)
    },
  })

  const onSubmit = (values: CreatePostInput) => {
    mutate(values)
  }

  return (
    <>
      <h1 className="text-6xl text-center font-bold">Create Post</h1>
      {/* another way to handle errors is access directly */}
      {/* {error && error.message} */}
      <form className="mt-20 ml-5" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="border border-black px-1 py-1"
          placeholder="Your post title"
          {...register('title')}
        />
        <br />
        {errors.title?.message && (
          <p className="text-red-600">{errors.title?.message}</p>
        )}
        <label className="block mt-2">Write the content of your post:</label>
        <textarea
          className="border border-black px-1 py-1 mt-1 h-96 w-11/12 md:w-1/2"
          {...register('body')}
        />
        <br />
        {errors.body?.message && (
          <p className="text-red-600">{errors.body?.message}</p>
        )}
        <button
          className="mt-3 rounded-lg bg-sky-300 enabled:hover:bg-sky-400 px-2 py-2 font-bold"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && (
            <FontAwesomeIcon
              className="inline mr-3 w-4 h-4 text-white fa-spin"
              icon={faSpinner}
            />
          )}
          {isLoading ? 'Loading...' : 'Create Post'}
        </button>
      </form>
    </>
  )
}
