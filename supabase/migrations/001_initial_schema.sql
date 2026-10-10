-- 1. PROFILES TABLE
-- Stores core user data and account roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('individual', 'company_admin', 'company_member')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USER PREFERENCES TABLE
-- Theme and accessibility settings
CREATE TABLE user_preferences (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'indigo-violet',
  mode TEXT CHECK (mode IN ('light', 'dark', 'system')) DEFAULT 'system',
  text_size TEXT DEFAULT 'medium',
  reduced_motion BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORGANIZATIONS TABLE
-- Company details and verification status
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  official_email TEXT,
  industry TEXT,
  size TEXT,
  country TEXT,
  website TEXT,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORGANIZATION MEMBERS TABLE
-- Role-based access within companies
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'manager', 'trainer', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 5. SKILLS TABLE
-- Master list of skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SKILL ASSESSMENTS TABLE
-- Demonstrated vs self-reported levels
CREATE TABLE skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  self_reported_level TEXT CHECK (self_reported_level IN ('Beginner', 'Developing', 'Intermediate', 'Advanced')),
  demonstrated_level TEXT CHECK (demonstrated_level IN ('Beginner', 'Developing', 'Intermediate', 'Advanced')),
  evidence_type TEXT, -- 'quiz', 'project', 'trainer_verified'
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- 7. ACTION PLANS TABLE
-- Personalized roadmaps
CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  progress_percent INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TASKS TABLE
-- Steps within a plan
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES action_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration TEXT,
  resources TEXT,
  completion_criteria TEXT,
  order_index INT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. OPPORTUNITIES TABLE
-- Verified resources
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  source_url TEXT NOT NULL,
  eligibility TEXT,
  cost_info TEXT,
  device_requirements TEXT,
  internet_requirements TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  last_verified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('published', 'draft', 'archived')) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. SAVED OPPORTUNITIES TABLE
CREATE TABLE saved_opportunities (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, opportunity_id)
);

-- 11. SHARING CONSENTS TABLE
-- Explicit permission for company access
CREATE TABLE sharing_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  shared_skills BOOLEAN DEFAULT FALSE,
  shared_progress BOOLEAN DEFAULT FALSE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, organization_id)
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_id UUID,
  target_table TEXT,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Preferences: Users can manage own preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences ALL USING (auth.uid() = user_id);

-- Opportunities: Anyone can view published opportunities
CREATE POLICY "Anyone can view published opportunities" ON opportunities FOR SELECT USING (status = 'published');

-- Saved Opportunities: Users can manage their own saved items
CREATE POLICY "Users can manage own saved opportunities" ON saved_opportunities ALL USING (auth.uid() = user_id);

-- Action Plans & Tasks: Users manage their own
CREATE POLICY "Users can manage own action plans" ON action_plans ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tasks" ON tasks ALL USING (
  EXISTS (SELECT 1 FROM action_plans WHERE id = tasks.plan_id AND user_id = auth.uid())
);

-- Skill Assessments: Users manage own; Companies view if consent given
CREATE POLICY "Users can manage own assessments" ON skill_assessments ALL USING (auth.uid() = user_id);
CREATE POLICY "Companies can view assessments with consent" ON skill_assessments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM sharing_consents
    JOIN organization_members ON sharing_consents.organization_id = organization_members.organization_id
    WHERE sharing_consents.user_id = skill_assessments.user_id
    AND organization_members.user_id = auth.uid()
    AND sharing_consents.shared_skills = TRUE
  )
);

-- Sharing Consents: Users manage their own
CREATE POLICY "Users can manage own sharing consents" ON sharing_consents ALL USING (auth.uid() = user_id);

-- Audit Logs: Only admins can view
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'company_admin')
);
