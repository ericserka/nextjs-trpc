import { useUserContext } from '@/context/user.context'
import { UpdatePostInput, updatePostSchema } from '@/schema/post.schema'
import { trpc } from '@/utils/trpc'
import {
  faEdit,
  faInfo,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import CustomModal from '../components/CustomModal'
import { zodResolver } from '@hookform/resolvers/zod'
import { objectEquals } from '@/utils/snippets'

const Home: NextPage = () => {
  const user = useUserContext()
  const router = useRouter()
  const [clicked, setClicked] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [post, setPost] = useState<UpdatePostInput>({
    title: '',
    body: '',
    postId: '',
  })
  const posts = trpc.useInfiniteQuery(['posts.get-all-paginated', {}], {
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  })
  const deleteMutation = trpc.useMutation(['posts.delete'], {
    onSuccess: (data) => {
      posts.refetch()
    },
    onError: (error) => {
      alert(error.message)
    },
  })
  const updateMutation = trpc.useMutation(['posts.update'], {
    onSuccess: (data) => {
      setPost({ title: data?.title, body: data?.body, postId: data?.id! })
      posts.refetch()
      alert('Post updated successfully')
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const {
    formState: { errors },
    register,
    reset,
    setValue,
    handleSubmit,
  } = useForm<UpdatePostInput>({
    resolver: zodResolver(updatePostSchema),
  })

  const handleEditPostSubmit = (formValues: UpdatePostInput) => {
    if (!objectEquals(formValues, post)) {
      updateMutation.mutate(formValues)
    } else {
      alert('Update some content before trying to submit the form')
    }
  }

  useEffect(() => {
    if (clicked) {
      deleteMutation.mutate({ postId: clicked })
    }
  }, [clicked])

  if (!user) {
    router.push('/login')
    return <></>
  } else {
    if (posts.isLoading) {
      return (
        <div className="grid place-items-center w-screen h-screen">
          <FontAwesomeIcon className="w-1/2 fa-spin fa-2xl" icon={faSpinner} />
        </div>
      )
    }
    return (
      <div className="grid place-items-center container mx-auto">
        <div
          onClick={() => router.push('/posts/new')}
          className="mt-4 rounded-lg bg-purple-300 hover:bg-purple-400 font-bold text-center text-2xl p-10 cursor-pointer"
        >
          Create post
        </div>
        <h1 className="mt-6 text-5xl font-bold text-center">Your Posts</h1>
        {posts.isError && (
          <h1 className="mt-6 text-3xl font-bold text-center">
            There was an error trying to retrieve the posts. Try again later
          </h1>
        )}
        <div className="grid place-items-center mt-6">
          {posts.data?.pages.map((d, i) => (
            <div key={i}>
              {d?.items.map((item) => (
                <div key={item.id} className="flex space-x-4 m-1">
                  <p>{item.title}</p>
                  <FontAwesomeIcon
                    className="text-blue-300 cursor-pointer"
                    icon={faInfo}
                    onClick={() => router.push(`/posts/${item.id}`)}
                  />
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faEdit}
                    onClick={() => {
                      setPost({
                        postId: item.id,
                        title: item.title,
                        body: item.body,
                      })
                      setValue('body', item.body)
                      setValue('title', item.title)
                      setValue('postId', item.id)
                      setShowEditModal(true)
                    }}
                  />
                  <button
                    onClick={() => setClicked(item.id)}
                    disabled={deleteMutation.isLoading}
                  >
                    {deleteMutation.isLoading && clicked === item.id ? (
                      <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                    ) : (
                      <FontAwesomeIcon
                        className="text-red-600"
                        icon={faTrash}
                      />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        {!posts.isError && posts.hasNextPage && (
          <button
            className="mt-3 rounded-lg bg-sky-300 enabled:hover:bg-sky-400 px-2 py-2 font-bold"
            onClick={() => posts.fetchNextPage()}
            disabled={posts.isFetchingNextPage}
          >
            {posts.isFetchingNextPage && (
              <FontAwesomeIcon
                className="inline mr-3 w-4 h-4 text-white fa-spin"
                icon={faSpinner}
              />
            )}
            {posts.isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        )}
        <CustomModal
          isOpen={showEditModal}
          onClose={() => {
            reset()
            setShowEditModal(false)
          }}
          preventClosure={updateMutation.isLoading}
        >
          <h1 className="text-4xl text-center font-bold">Update Post</h1>
          <form onSubmit={handleSubmit(handleEditPostSubmit)} className="mt-5">
            <input
              className="border border-black px-1 py-1 w-full"
              {...register('title')}
            />
            <br />
            {errors.title?.message && (
              <p className="text-red-600">{errors.title?.message}</p>
            )}
            <label className="block mt-2">
              Update the content of your post:
            </label>
            <textarea
              className="border border-black px-1 py-1 mt-1 max-h-96 min-h-[192px] w-full"
              {...register('body')}
            />
            <br />
            {errors.body?.message && (
              <p className="text-red-600">{errors.body?.message}</p>
            )}
            <button
              className="mt-3 rounded-lg bg-sky-300 enabled:hover:bg-sky-400 px-2 py-2 font-bold"
              type="submit"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading && (
                <FontAwesomeIcon
                  className="inline mr-3 w-4 h-4 text-white fa-spin"
                  icon={faSpinner}
                />
              )}
              {updateMutation.isLoading ? 'Loading...' : 'Update Post'}
            </button>
          </form>
        </CustomModal>
      </div>
    )
  }
}

export default Home
