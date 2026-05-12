-- ===========================================================================
-- Initial seed — mirrors the original src/lib/data.js content.
-- Run this AFTER 01_schema.sql.
-- Safe to re-run: clears each table then re-inserts.
-- ===========================================================================

-- Wipe (in dependency order)
delete from public.skill_items;
delete from public.skill_groups;
delete from public.experience;
delete from public.projects;
delete from public.certifications;
delete from public.languages;
delete from public.education;
delete from public.nav_items;
delete from public.profile;

-- profile (singleton)
insert into public.profile (id, name, first_name, last_name, role, location, status, blurb, email, phone, github, linkedin)
values (
  1,
  'Jerin Davis',
  'Jerin',
  'Davis',
  'BCA Student · ERP & Business Process Enthusiast',
  'Bangalore, India',
  'Available for work',
  'Motivated BCA student turning business problems into elegant, technology-driven solutions. Foundation in databases, SQL, and software systems, sharpened by hands-on project coordination across cross-functional teams.',
  'jerindavis82@yahoo.com',
  '+91 8593059685',
  'https://github.com/jerindavispm',
  'https://www.linkedin.com/in/jerin-davis-dev'
);

-- nav_items
insert into public.nav_items (label, href, sort_order) values
  ('Work',     '#work',     1),
  ('Projects', '#projects', 2),
  ('Skills',   '#skills',   3),
  ('About',    '#about',    4),
  ('Contact',  '#contact',  5);

-- experience
insert into public.experience (role, company, type, duration, summary, highlights, tools, sort_order) values
  (
    'Project Coordinator',
    'UPDOT',
    'Internship',
    '2 months',
    'Coordinated client projects across cross-functional teams — managing timelines, documentation, and stakeholder communication for timely, accountable delivery.',
    array[
      'Owned project documentation end-to-end across multiple client engagements',
      'Coordinated daily standups and async updates between design, engineering, and client teams',
      'Translated client requirements into actionable workstreams and clear deliverables'
    ],
    array['ProofHub','Asana','Monday.com','Slack','Google Meet'],
    1
  );

-- projects
insert into public.projects (name, tag, year, summary, role, stack, link, sort_order) values
  (
    'ScanGenius.ai',
    'ATS Resume Scoring',
    '2025',
    'An intelligent resume evaluator that helps job seekers slip past Applicant Tracking System filters and improve interview conversion.',
    'Contributor',
    array['Python','NLP','SQL'],
    null,
    1
  ),
  (
    'Red Room Gaming Store',
    'GameStore UI',
    '2024',
    'An interactive web platform showcasing video games across genres — built collaboratively with a focus on visual identity and friction-free browsing.',
    'Team Lead',
    array['HTML','CSS','JavaScript'],
    null,
    2
  );

-- skill_groups + skill_items
with g as (
  insert into public.skill_groups (name, sort_order) values
    ('Languages',         1),
    ('Web & Markup',      2),
    ('Data',              3),
    ('Project & Comms',   4)
  returning id, name
)
insert into public.skill_items (group_id, label, sort_order)
select g.id, s.label, s.sort_order
from g
join (values
  ('Languages',       'Python',       1),
  ('Languages',       'Java',         2),
  ('Languages',       'C',            3),
  ('Languages',       'JavaScript',   4),

  ('Web & Markup',    'HTML',         1),
  ('Web & Markup',    'XML',          2),

  ('Data',            'SQL',          1),
  ('Data',            'DBMS',         2),

  ('Project & Comms', 'ProofHub',     1),
  ('Project & Comms', 'Asana',        2),
  ('Project & Comms', 'Monday.com',   3),
  ('Project & Comms', 'Slack',        4),
  ('Project & Comms', 'Google Meet',  5)
) as s(group_name, label, sort_order) on s.group_name = g.name;

-- certifications
insert into public.certifications (name, date_label, is_ongoing, sort_order) values
  ('Electronic Arts — Software Engineering Job Simulation', 'Mar 2024', false, 1),
  ('The Joy of Computing Using Python',                     'May 2024', false, 2),
  ('CAPM Course',                                            'Ongoing',  true,  3);

-- languages
insert into public.languages (name, sort_order) values
  ('English',   1),
  ('Tamil',     2),
  ('Malayalam', 3),
  ('Hindi',     4);

-- education
insert into public.education (school, degree, location, period, sort_order) values
  ('CMR University',     'Bachelor of Computer Applications (BCA)', 'Bangalore, Karnataka', '2023 – 2026', 1),
  ('Tolins World School','High School · Bio-informatics',           'Malayattoor, Kerala',  '',            2);
