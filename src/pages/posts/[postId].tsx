import { trpc } from '@/utils/trpc'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function SinglePostPage() {
  const router = useRouter()
  const { data, isLoading } = trpc.useQuery([
    'posts.get-by-id',
    {
      postId: router.query.postId as string,
    },
  ])
  if (isLoading) {
    return (
      <div className="grid place-items-center w-screen h-screen">
        <FontAwesomeIcon className="w-1/2 fa-spin fa-2xl" icon={faSpinner} />
      </div>
    )
  }
  if (!data) {
    return <Error statusCode={404} />
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-6xl text-center font-bold">{data.title}</h1>
      <p className="text-center mt-10">{data.body}</p>
    </div>
  )
}
