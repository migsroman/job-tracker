import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
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

    // Get user's job applications using authenticated Supabase client
    const { data: jobs, error: jobsError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (jobsError) {
      console.error('Error fetching jobs:', jobsError)
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
    }

    return NextResponse.json(jobs || [])
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    
    // Validate required fields
    const { jobTitle, companyName, location, status, priority, applicationDate, jobUrl, notes, salaryRange } = body
    
    if (!jobTitle || !companyName || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create job application using authenticated Supabase client
    const { data: job, error: jobError } = await supabase
      .from('job_applications')
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        company_name: companyName,
        location,
        status: status || 'INTERESTED',
        priority: priority || 'MEDIUM',
        application_date: applicationDate || new Date().toISOString(),
        job_url: jobUrl,
        notes,
        salary_range: salaryRange
      })
      .select()
      .single()

    if (jobError) {
      console.error('Error creating job:', jobError)
      return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
    }

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}