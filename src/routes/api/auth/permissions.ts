import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start/server'

export const Route = createFileRoute('/api/auth/permissions')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const cookie = request.headers.get('cookie') || ''
        const match = cookie.match(/session_token=([^;]+)/)
        const token = match?.[1]

        if (!token) {
          return json({
            userId: '',
            roles: [],
            rolePermissions: [],
            resourcePermissions: [],
            isAdmin: false,
          })
        }

        const { verifySession } = await import('@/lib/auth/session')
        const session = await verifySession(token)

        if (!session) {
          return json({
            userId: '',
            roles: [],
            rolePermissions: [],
            resourcePermissions: [],
            isAdmin: false,
          })
        }

        const { getDb } = await import('@/lib/db/config')
        const db = getDb()

        const roles = await db('roles')
          .join('user_roles', 'roles.id', 'user_roles.role_id')
          .where('user_roles.user_id', session.user.id)
          .select('roles.*')

        const rolePermissions: string[] = roles.flatMap((role: { permissions: string }) => {
          try {
            return JSON.parse(role.permissions)
          } catch {
            return []
          }
        })

        const isAdmin = roles.some((r: { name: string }) => r.name === 'admin' || r.name === 'Admin')

        const resourcePermissions = await db('data_source_entity_permissions')
          .where('user_id', session.user.id)
          .select('*')
          .catch(() => [])

        return json({
          userId: session.user.id,
          roles: roles.map((r: { id: string; name: string; permissions: string }) => ({
            id: r.id,
            name: r.name,
            permissions: r.permissions,
          })),
          rolePermissions: Array.from(new Set(rolePermissions)),
          resourcePermissions,
          isAdmin,
        })
      },
    },
  },
})
