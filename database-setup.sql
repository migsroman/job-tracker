-- JobTracker Pro Database Schema for Supabase
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE application_status AS ENUM (
  'INTERESTED',
  'APPLIED', 
  'UNDER_REVIEW',
  'PHONE_SCREEN',
  'INTERVIEW_ROUND_1',
  'INTERVIEW_ROUND_2', 
  'INTERVIEW_FINAL',
  'REFERENCE_CHECK',
  'OFFER_RECEIVED',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
  'NO_RESPONSE'
);

CREATE TYPE priority_level AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE view_mode AS ENUM ('LIST', 'CARDS');
CREATE TYPE theme_preference AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  preferred_view view_mode DEFAULT 'LIST',
  email_notifications BOOLEAN DEFAULT true,
  theme theme_preference DEFAULT 'SYSTEM',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table  
CREATE TABLE public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL,
  status application_status DEFAULT 'INTERESTED',
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  job_url TEXT,
  notes TEXT,
  salary_range TEXT,
  priority priority_level DEFAULT 'MEDIUM',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_applications_application_date ON public.job_applications(application_date);
CREATE INDEX idx_job_applications_updated_at ON public.job_applications(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own jobs" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobs" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON public.job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON public.job_applications FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();