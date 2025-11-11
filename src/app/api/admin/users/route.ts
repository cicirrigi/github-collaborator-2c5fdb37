/**
 * 👑 Admin Users API – Vantage Lane 2.0
 *
 * Admin-only endpoints using requireRole guard
 * - Role-based access control
 * - Admin user management
 * - Audit logging
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/features/auth/guards/auth.guard';

/* --------------------------------------------------
 * 📝 Admin Schemas
 * -------------------------------------------------- */

const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['user', 'admin', 'superadmin']),
});

const updateUserStatusSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['active', 'suspended', 'banned']),
});

/* --------------------------------------------------
 * 👥 GET /api/admin/users - List all users
 * -------------------------------------------------- */

export async function GET(request: Request) {
  try {
    // Require admin or superadmin role
    const { supabase, user: adminUser } = await requireRole(['admin', 'superadmin'], {
      throwError: true, // Throw error instead of redirect for API routes
    });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    // Get users with their metadata
    const {
      data: users,
      error,
      count,
    } = await supabase
      .from('users')
      .select(
        `
        id,
        email,
        created_at,
        updated_at,
        user_metadata,
        app_metadata,
        last_sign_in_at,
        email_confirmed_at
      `,
        { count: 'exact' }
      )
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Log admin action
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminUser.id,
      action: 'list_users',
      details: { page, limit, total_count: count },
    });

    return NextResponse.json({
      users: users ?? [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.app_metadata?.roles?.[0] || adminUser.user_metadata?.role,
      },
    });
  } catch (error) {
    console.error('Admin users GET error:', error);

    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* --------------------------------------------------
 * ✏️ PATCH /api/admin/users - Update user role/status
 * -------------------------------------------------- */

export async function PATCH(request: Request) {
  try {
    // Require superadmin role for user modifications
    const { supabase, user: adminUser } = await requireRole(['superadmin'], {
      throwError: true,
    });

    const json = await request.json();
    const action = json.action;

    if (action === 'update_role') {
      const parsed = updateUserRoleSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid request data', details: parsed.error.format() },
          { status: 400 }
        );
      }

      const { userId, role } = parsed.data;

      // Update user role in app_metadata
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { roles: [role] },
      });

      if (error) {
        console.error('Failed to update user role:', error);
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
      }

      // Log admin action
      await supabase.from('admin_audit_log').insert({
        admin_user_id: adminUser.id,
        action: 'update_user_role',
        target_user_id: userId,
        details: { old_role: null, new_role: role },
      });

      return NextResponse.json({
        message: 'User role updated successfully',
        userId,
        newRole: role,
      });
    } else if (action === 'update_status') {
      const parsed = updateUserStatusSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid request data', details: parsed.error.format() },
          { status: 400 }
        );
      }

      const { userId, status } = parsed.data;

      // Update user status in user_metadata
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { status },
      });

      if (error) {
        console.error('Failed to update user status:', error);
        return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
      }

      // Log admin action
      await supabase.from('admin_audit_log').insert({
        admin_user_id: adminUser.id,
        action: 'update_user_status',
        target_user_id: userId,
        details: { new_status: status },
      });

      return NextResponse.json({
        message: 'User status updated successfully',
        userId,
        newStatus: status,
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin users PATCH error:', error);

    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
