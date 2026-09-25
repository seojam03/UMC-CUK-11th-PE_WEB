import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/src/routes/movies/$movieId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/src/routes/movies/$movieId"!</div>
}
