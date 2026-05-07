import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getDb } from '@/lib/db/config';
import { addJob, addScheduledJob } from '@/lib/jobs/queue';
import { logAudit } from '@/lib/security/audit';
import { v4 as uuidv4 } from 'uuid';
import type { JobDefinition, JobExecution } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const db = getDb();
    const jobs = await db<JobDefinition>('jobs')
      .orderBy('created_at', 'desc');

    return NextResponse.json({
      success: true,
      data: { items: jobs, meta: { total: jobs.length } },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch jobs' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check if this is creating a job definition or executing a one-time job
    if (body.name && body.schedule_cron) {
      // Create job definition
      return await createJobDefinition(body, session);
    } else {
      // Execute one-time job
      return await executeJob(body, session);
    }
  } catch (error) {
    console.error('Error processing job request:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to process job request' } },
      { status: 500 }
    );
  }
}

async function createJobDefinition(body: any, session: any) {
  const {
    name,
    description,
    target_id, // Maps to query_id in database
    schedule_cron, // Maps to schedule in database
    is_active = true,
  } = body;

  if (!name || !target_id || !schedule_cron) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_INPUT', message: 'Name, target ID, and schedule are required' } },
      { status: 400 }
    );
  }

  const db = getDb();
  const jobId = uuidv4();

  // Create job definition - use column names that match database schema
  await db('jobs').insert({
    id: jobId,
    name,
    description: description || null,
    query_id: target_id, // Map target_id to query_id
    schedule: schedule_cron, // Map schedule_cron to schedule
    is_active,
    created_by: session.user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // If active, schedule the job in BullMQ
  if (is_active) {
    try {
      const jobData: any = {
        type: 'data:export',
        queryId: target_id,
        userId: session.user.id,
        format: 'csv',
      };

      await addScheduledJob(jobData, schedule_cron, { jobId });
    } catch (error) {
      console.error('Error scheduling job in BullMQ:', error);
      // Still return success, the DB record was created
    }
  }

  await logAudit({
    userId: session.user.id,
    action: 'create',
    resourceType: 'job_definition',
    resourceId: jobId,
    details: { name, schedule: schedule_cron },
  });

  return NextResponse.json({
    success: true,
    data: { id: jobId },
  }, { status: 201 });
}

async function executeJob(body: any, session: any) {
  const { jobType, targetId, parameters, priority } = body;

  if (!jobType || !targetId) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_INPUT', message: 'Job type and target ID are required' } },
      { status: 400 }
    );
  }

  // Create job execution record
  const db = getDb();
  const executionId = uuidv4();

  await db('job_executions').insert({
    id: executionId,
    job_definition_id: null,
    status: 'pending',
  });

  // Queue the job
  const jobData = {
    type: `${jobType}:generate` as const,
    [`${jobType}Id`]: targetId,
    userId: session.user.id,
    parameters,
  };

  const job = await addJob(jobData as any, { priority, jobId: executionId });

  await logAudit({
    userId: session.user.id,
    action: 'execute',
    resourceType: jobType,
    resourceId: targetId,
    details: { jobId: executionId },
  });

  return NextResponse.json({
    success: true,
    data: { jobId: executionId, status: 'pending' },
  });
}
