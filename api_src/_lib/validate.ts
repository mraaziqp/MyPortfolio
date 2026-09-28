/**
 * Input validation for anything that writes to the live CV. The site renders
 * this data to every visitor, so a malformed push must be rejected whole
 * rather than half-applied.
 */
import type {
  CertificationItem,
  CvSyncPayload,
  EducationItem,
  ExperienceItem,
  SkillCategoryMap,
} from '../../src/types';

export class ValidationError extends Error {}

const fail = (msg: string): never => {
  throw new ValidationError(msg);
};

export function str(value: unknown, field: string, max: number, required = true): string | undefined {
  if (value === undefined || value === null || value === '') {
    if (required) fail(`${field} is required.`);
    return undefined;
  }
  if (typeof value !== 'string') fail(`${field} must be a string.`);
  const trimmed = (value as string).trim();
  if (required && !trimmed) fail(`${field} is required.`);
  if (trimmed.length > max) fail(`${field} must be at most ${max} characters.`);
  return trimmed;
}

function strList(value: unknown, field: string, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) fail(`${field} must be an array of strings.`);
  const list = value as unknown[];
  if (list.length > maxItems) fail(`${field} may contain at most ${maxItems} items.`);
  return list.map((v, i) => str(v, `${field}[${i}]`, maxLen)!);
}

function url(value: unknown, field: string): string | undefined {
  const s = str(value, field, 500, false);
  if (s && !/^https?:\/\//i.test(s)) fail(`${field} must be an http(s) URL.`);
  return s;
}

export const SKILL_CATEGORIES: Array<keyof SkillCategoryMap> = [
  'languages',
  'frameworks',
  'cloudAndDevOps',
  'aiAndArchitecture',
  'enterpriseAndIT',
  'hardwareAndCreative',
];

function experience(value: any, i: number): ExperienceItem {
  const f = `experiences[${i}]`;
  if (!value || typeof value !== 'object') fail(`${f} must be an object.`);
  return {
    id: str(value.id, `${f}.id`, 80) as string,
    role: str(value.role, `${f}.role`, 160) as string,
    company: str(value.company, `${f}.company`, 160) as string,
    location: str(value.location, `${f}.location`, 160, false) || '',
    startDate: str(value.startDate, `${f}.startDate`, 20) as string,
    endDate: str(value.endDate, `${f}.endDate`, 20, false) || null,
    isCurrent: Boolean(value.isCurrent),
    summary: str(value.summary, `${f}.summary`, 1500, false) || '',
    keyAchievements: value.keyAchievements ? strList(value.keyAchievements, `${f}.keyAchievements`, 20, 600) : [],
    technologies: value.technologies ? strList(value.technologies, `${f}.technologies`, 30, 80) : [],
    enterpriseDomain: str(value.enterpriseDomain, `${f}.enterpriseDomain`, 160, false),
  };
}

function certification(value: any, i: number): CertificationItem {
  const f = `certifications[${i}]`;
  if (!value || typeof value !== 'object') fail(`${f} must be an object.`);
  return {
    id: str(value.id, `${f}.id`, 80) as string,
    name: str(value.name, `${f}.name`, 200) as string,
    issuer: str(value.issuer, `${f}.issuer`, 200) as string,
    issueDate: str(value.issueDate, `${f}.issueDate`, 60, false) || '',
    expiryDate: str(value.expiryDate, `${f}.expiryDate`, 60, false),
    credentialId: str(value.credentialId, `${f}.credentialId`, 120, false),
    badgeUrl: url(value.badgeUrl, `${f}.badgeUrl`),
  };
}

function education(value: any, i: number): EducationItem {
  const f = `education[${i}]`;
  if (!value || typeof value !== 'object') fail(`${f} must be an object.`);
  return {
    id: str(value.id, `${f}.id`, 80) as string,
    degree: str(value.degree, `${f}.degree`, 200) as string,
    institution: str(value.institution, `${f}.institution`, 200) as string,
    year: str(value.year, `${f}.year`, 60, false) || '',
    details: str(value.details, `${f}.details`, 800, false),
  };
}

function skills(value: any, current: SkillCategoryMap): SkillCategoryMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('skills must be an object of string arrays.');
  const next = { ...current };
  for (const key of Object.keys(value)) {
    if (!SKILL_CATEGORIES.includes(key as keyof SkillCategoryMap)) {
      fail(`skills.${key} is not a known category (${SKILL_CATEGORIES.join(', ')}).`);
    }
    (next as any)[key] = strList(value[key], `skills.${key}`, 40, 80);
  }
  return next;
}

/**
 * Applies a partial CV update on top of `current`. Only known fields are
 * read; arrays replace wholesale. Throws ValidationError on the first problem.
 */
export function mergeCvPayload(current: CvSyncPayload, input: Record<string, any>): CvSyncPayload {
  const next: CvSyncPayload = JSON.parse(JSON.stringify(current));

  if ('fullName' in input) next.fullName = str(input.fullName, 'fullName', 120)!;
  if ('headline' in input) next.headline = str(input.headline, 'headline', 200)!;
  if ('summary' in input) next.summary = str(input.summary, 'summary', 3000)!;
  if ('location' in input) next.location = str(input.location, 'location', 160)!;
  if ('email' in input) {
    const email = str(input.email, 'email', 200)!;
    if (!EMAIL_RE.test(email)) fail('email is not a valid address.');
    next.email = email;
  }
  if ('phone' in input) next.phone = str(input.phone, 'phone', 40, false);
  if ('githubUrl' in input) next.githubUrl = url(input.githubUrl, 'githubUrl');
  if ('linkedinUrl' in input) next.linkedinUrl = url(input.linkedinUrl, 'linkedinUrl');
  if ('websiteUrl' in input) next.websiteUrl = url(input.websiteUrl, 'websiteUrl');

  if ('experiences' in input) {
    if (!Array.isArray(input.experiences) || input.experiences.length > 30) {
      fail('experiences must be an array of at most 30 items.');
    }
    next.experiences = input.experiences.map(experience);
  }
  if ('certifications' in input) {
    if (!Array.isArray(input.certifications) || input.certifications.length > 30) {
      fail('certifications must be an array of at most 30 items.');
    }
    next.certifications = input.certifications.map(certification);
  }
  if ('education' in input) {
    if (!Array.isArray(input.education) || input.education.length > 20) {
      fail('education must be an array of at most 20 items.');
    }
    next.education = input.education.map(education);
  }
  if ('skills' in input) next.skills = skills(input.skills, next.skills);

  if ('availability' in input) {
    const a = input.availability;
    if (!a || typeof a !== 'object') fail('availability must be an object.');
    next.availability = {
      openToWork: Boolean(a.openToWork),
      note: str(a.note, 'availability.note', 160, false),
    };
  }

  if ('version' in input) next.version = str(input.version, 'version', 40)!;
  return next;
}

export const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;
