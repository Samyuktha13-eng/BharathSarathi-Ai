import { generateComplaintId, currentTimestamp, formatDate } from '../lib/utils.js'
import { assistantPrompt, schemePrompt, complaintPrompt } from '../lib/prompts.js'

// ─── Validation Regex (mirrors signup.js) ───────────────────────────────────
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
const nameRe = /^[a-zA-Z\s]{2,}$/
const STATUSES = ['Submitted', 'In Review', 'Resolved']

// ─── Email Validation ────────────────────────────────────────────────────────
describe('Email Validation', () => {
  it('accepts valid email', () => expect(emailRe.test('user@example.com')).toBe(true))
  it('accepts subdomain email', () => expect(emailRe.test('user@mail.gov.in')).toBe(true))
  it('rejects missing @', () => expect(emailRe.test('userexample.com')).toBe(false))
  it('rejects missing domain', () => expect(emailRe.test('user@')).toBe(false))
  it('rejects empty string', () => expect(emailRe.test('')).toBe(false))
  it('rejects spaces in email', () => expect(emailRe.test('user @example.com')).toBe(false))
})

// ─── Password Validation ─────────────────────────────────────────────────────
describe('Password Validation', () => {
  it('accepts strong password', () => expect(passwordRe.test('Test@1234')).toBe(true))
  it('accepts password with symbols', () => expect(passwordRe.test('Secure#99!')).toBe(true))
  it('rejects no uppercase', () => expect(passwordRe.test('test@1234')).toBe(false))
  it('rejects no lowercase', () => expect(passwordRe.test('TEST@1234')).toBe(false))
  it('rejects no special char', () => expect(passwordRe.test('Test1234')).toBe(false))
  it('rejects no digit', () => expect(passwordRe.test('Test@abcd')).toBe(false))
  it('rejects short password', () => expect(passwordRe.test('T@1a')).toBe(false))
})

// ─── Name Validation ─────────────────────────────────────────────────────────
describe('Name Validation', () => {
  it('accepts valid name', () => expect(nameRe.test('Priya Sharma')).toBe(true))
  it('accepts single word name', () => expect(nameRe.test('Rahul')).toBe(true))
  it('rejects numbers in name', () => expect(nameRe.test('Priya123')).toBe(false))
  it('rejects single char', () => expect(nameRe.test('P')).toBe(false))
  it('rejects special characters', () => expect(nameRe.test('Priya@')).toBe(false))
})

// ─── Complaint Status Flow ───────────────────────────────────────────────────
describe('Complaint Status Flow', () => {
  it('has exactly 3 stages', () => expect(STATUSES.length).toBe(3))
  it('starts at Submitted', () => expect(STATUSES[0]).toBe('Submitted'))
  it('second stage is In Review', () => expect(STATUSES[1]).toBe('In Review'))
  it('ends at Resolved', () => expect(STATUSES[2]).toBe('Resolved'))
  it('progresses Submitted → In Review', () => {
    let idx = STATUSES.indexOf('Submitted')
    idx = Math.min(idx + 1, STATUSES.length - 1)
    expect(STATUSES[idx]).toBe('In Review')
  })
  it('progresses In Review → Resolved', () => {
    let idx = STATUSES.indexOf('In Review')
    idx = Math.min(idx + 1, STATUSES.length - 1)
    expect(STATUSES[idx]).toBe('Resolved')
  })
  it('does not progress past Resolved', () => {
    let idx = STATUSES.indexOf('Resolved')
    idx = Math.min(idx + 1, STATUSES.length - 1)
    expect(STATUSES[idx]).toBe('Resolved')
  })
})

// ─── Utility Functions ───────────────────────────────────────────────────────
describe('generateComplaintId', () => {
  it('starts with SB-', () => expect(generateComplaintId()).toMatch(/^SB-/))
  it('has correct length (SB- + 8 chars)', () => expect(generateComplaintId()).toHaveLength(11))
  it('is uppercase after SB-', () => expect(generateComplaintId()).toMatch(/^SB-[A-Z0-9]{8}$/))
  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 50 }, generateComplaintId))
    expect(ids.size).toBe(50)
  })
})

describe('currentTimestamp', () => {
  it('returns a valid ISO string', () => {
    const ts = currentTimestamp()
    expect(() => new Date(ts)).not.toThrow()
    expect(new Date(ts).toISOString()).toBe(ts)
  })
  it('is close to current time', () => {
    const before = Date.now()
    const ts = currentTimestamp()
    const after = Date.now()
    const parsed = new Date(ts).getTime()
    expect(parsed).toBeGreaterThanOrEqual(before)
    expect(parsed).toBeLessThanOrEqual(after)
  })
})

describe('formatDate', () => {
  it('formats ISO date to readable string', () => {
    const result = formatDate('2024-01-15T00:00:00.000Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
  it('includes the year', () => {
    const result = formatDate('2024-06-01T00:00:00.000Z')
    expect(result).toContain('2024')
  })
})

// ─── Prompt Templates ────────────────────────────────────────────────────────
describe('assistantPrompt', () => {
  it('includes the question', () => {
    const p = assistantPrompt('How to get Aadhaar card?', 'en')
    expect(p).toContain('How to get Aadhaar card?')
  })
  it('includes the language code', () => {
    const p = assistantPrompt('test', 'hi')
    expect(p).toContain('hi')
  })
  it('mentions Sarthi', () => {
    const p = assistantPrompt('test', 'en')
    expect(p).toContain('Sarthi')
  })
  it('defaults lang to en', () => {
    const p = assistantPrompt('test')
    expect(p).toContain('en')
  })
})

describe('schemePrompt', () => {
  const details = { age: '25', income: '2LPA', occupation: 'farmer', state: 'Maharashtra', gender: 'Male', lang: 'en' }
  it('includes age', () => expect(schemePrompt(details)).toContain('25'))
  it('includes state', () => expect(schemePrompt(details)).toContain('Maharashtra'))
  it('includes occupation', () => expect(schemePrompt(details)).toContain('farmer'))
  it('includes income', () => expect(schemePrompt(details)).toContain('2LPA'))
  it('includes gender', () => expect(schemePrompt(details)).toContain('Male'))
})

describe('complaintPrompt', () => {
  it('includes description', () => {
    const p = complaintPrompt('No street light', 'Pune', 'en')
    expect(p).toContain('No street light')
  })
  it('includes location', () => {
    const p = complaintPrompt('issue', 'Delhi', 'en')
    expect(p).toContain('Delhi')
  })
  it('includes language', () => {
    const p = complaintPrompt('issue', 'Mumbai', 'ta')
    expect(p).toContain('ta')
  })
  it('asks for formal complaint letter', () => {
    const p = complaintPrompt('issue', 'loc', 'en')
    expect(p.toLowerCase()).toContain('formal')
  })
})
