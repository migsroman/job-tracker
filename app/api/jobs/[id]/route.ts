import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface Params {
  id: string
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    // Get user from Supabase auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with user's JWT token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get specific job application using authenticated Supabase client
    const { data: job, error: jobError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    // Get user from Supabase auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with user's JWT token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Transform field names to database format
    const dbUpdates: any = {}
    if (body.jobTitle !== undefined) dbUpdates.job_title = body.jobTitle
    if (body.companyName !== undefined) dbUpdates.company_name = body.companyName
    if (body.location !== undefined) dbUpdates.location = body.location
    if (body.status !== undefined) dbUpdates.status = body.status
    if (body.priority !== undefined) dbUpdates.priority = body.priority
    if (body.applicationDate !== undefined) dbUpdates.application_date = body.applicationDate
    if (body.jobUrl !== undefined) dbUpdates.job_url = body.jobUrl
    if (body.notes !== undefined) dbUpdates.notes = body.notes
    if (body.salaryRange !== undefined) dbUpdates.salary_range = body.salaryRange

    // Update job application using authenticated Supabase client
    const { data: updatedJob, error: updateError } = await supabase
      .from('job_applications')
      .update(dbUpdates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError || !updatedJob) {
      return NextResponse.json({ error: 'Job not found or update failed' }, { status: 404 })
    }

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    // Get user from Supabase auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with user's JWT token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete job application using authenticated Supabase client
    const { error: deleteError } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: 'Job not found or delete failed' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}