import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { auth } from '@/lib/auth/config'

async function getSession(request: Request) {
  return auth(request)
}

export const Route = createFileRoute('/api/admin/permissions')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { message: 'Not authenticated' } }, { status: 401 })
          }

          const permissions = {
            success: true,
            data: [
              { id: 'read', name: 'Read' },
              { id: 'write', name: 'Write' },
              { id: 'delete', name: 'Delete' },
              { id: 'admin', name: 'Admin' },
            ]
          }

          return json(permissions)
        } catch (error) {
          console.error('Error fetching permissions:', error)
          return json({ success: false, error: { message: 'Failed to fetch permissions' } }, { status: 500 })
        }
      },
    },
  },
})
