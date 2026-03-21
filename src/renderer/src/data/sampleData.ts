export type TransactionType = 'income' | 'expense'

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Gift'
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Entertainment'
  | 'Healthcare'
  | 'Shopping'
  | 'Education'
  | 'Other'

export const INCOME_CATEGORIES: Category[] = ['Salary', 'Freelance', 'Investment', 'Gift']

export const EXPENSE_CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other',
]

export const ALL_CATEGORIES: Category[] = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

export interface Transaction {
  id: string
  type: TransactionType
  category: Category
  amount: number
  description: string
  date: string
  createdAt: string
}

export const sampleTransactions: Transaction[] = [
  // ── March 2026 ────────────────────────────────────────────────
  {
    id: '1',
    type: 'income',
    category: 'Salary',
    amount: 5200,
    description: 'Monthly salary — March 2026',
    date: '2026-03-01',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: '2',
    type: 'expense',
    category: 'Housing',
    amount: 1500,
    description: 'Rent payment — March',
    date: '2026-03-02',
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: '3',
    type: 'expense',
    category: 'Food',
    amount: 320,
    description: 'Weekly groceries',
    date: '2026-03-05',
    createdAt: '2026-03-05T14:00:00Z',
  },
  {
    id: '4',
    type: 'expense',
    category: 'Transport',
    amount: 180,
    description: 'Monthly Touch \'n Go reload',
    date: '2026-03-06',
    createdAt: '2026-03-06T08:00:00Z',
  },
  {
    id: '5',
    type: 'income',
    category: 'Freelance',
    amount: 1200,
    description: 'Web design project',
    date: '2026-03-10',
    createdAt: '2026-03-10T16:00:00Z',
  },
  {
    id: '6',
    type: 'expense',
    category: 'Entertainment',
    amount: 55,
    description: 'Netflix + Spotify',
    date: '2026-03-12',
    createdAt: '2026-03-12T20:00:00Z',
  },
  {
    id: '7',
    type: 'expense',
    category: 'Food',
    amount: 95,
    description: 'Team lunch at Pavilion',
    date: '2026-03-14',
    createdAt: '2026-03-14T13:00:00Z',
  },
  {
    id: '8',
    type: 'expense',
    category: 'Shopping',
    amount: 450,
    description: 'New sneakers — Adidas',
    date: '2026-03-15',
    createdAt: '2026-03-15T11:00:00Z',
  },
  {
    id: '9',
    type: 'income',
    category: 'Investment',
    amount: 380,
    description: 'ASB dividend payout',
    date: '2026-03-18',
    createdAt: '2026-03-18T09:00:00Z',
  },
  {
    id: '10',
    type: 'expense',
    category: 'Healthcare',
    amount: 120,
    description: 'Clinic visit + pharmacy',
    date: '2026-03-20',
    createdAt: '2026-03-20T15:00:00Z',
  },

  // ── February 2026 ─────────────────────────────────────────────
  {
    id: '11',
    type: 'income',
    category: 'Salary',
    amount: 5200,
    description: 'Monthly salary — February 2026',
    date: '2026-02-01',
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: '12',
    type: 'expense',
    category: 'Housing',
    amount: 1500,
    description: 'Rent payment — February',
    date: '2026-02-02',
    createdAt: '2026-02-02T10:00:00Z',
  },
  {
    id: '13',
    type: 'expense',
    category: 'Food',
    amount: 290,
    description: 'Weekly groceries',
    date: '2026-02-05',
    createdAt: '2026-02-05T14:00:00Z',
  },
  {
    id: '14',
    type: 'expense',
    category: 'Education',
    amount: 399,
    description: 'Udemy course bundle',
    date: '2026-02-15',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: '15',
    type: 'income',
    category: 'Freelance',
    amount: 800,
    description: 'Logo & branding project',
    date: '2026-02-20',
    createdAt: '2026-02-20T16:00:00Z',
  },
  {
    id: '16',
    type: 'expense',
    category: 'Transport',
    amount: 160,
    description: 'Grab rides — February',
    date: '2026-02-22',
    createdAt: '2026-02-22T18:00:00Z',
  },

  // ── January 2026 ──────────────────────────────────────────────
  {
    id: '17',
    type: 'income',
    category: 'Salary',
    amount: 5200,
    description: 'Monthly salary — January 2026',
    date: '2026-01-01',
    createdAt: '2026-01-01T09:00:00Z',
  },
  {
    id: '18',
    type: 'expense',
    category: 'Housing',
    amount: 1500,
    description: 'Rent payment — January',
    date: '2026-01-02',
    createdAt: '2026-01-02T10:00:00Z',
  },
  {
    id: '19',
    type: 'expense',
    category: 'Shopping',
    amount: 780,
    description: 'CNY clothing & gifts',
    date: '2026-01-10',
    createdAt: '2026-01-10T12:00:00Z',
  },
  {
    id: '20',
    type: 'income',
    category: 'Gift',
    amount: 600,
    description: 'CNY ang pao from family',
    date: '2026-01-25',
    createdAt: '2026-01-25T10:00:00Z',
  },
  {
    id: '21',
    type: 'expense',
    category: 'Entertainment',
    amount: 120,
    description: 'CNY dinner celebration',
    date: '2026-01-28',
    createdAt: '2026-01-28T19:00:00Z',
  },

  // ── December 2025 ─────────────────────────────────────────────
  {
    id: '22',
    type: 'income',
    category: 'Salary',
    amount: 5200,
    description: 'Monthly salary — December 2025',
    date: '2025-12-01',
    createdAt: '2025-12-01T09:00:00Z',
  },
  {
    id: '23',
    type: 'expense',
    category: 'Housing',
    amount: 1500,
    description: 'Rent payment — December',
    date: '2025-12-02',
    createdAt: '2025-12-02T10:00:00Z',
  },
  {
    id: '24',
    type: 'expense',
    category: 'Shopping',
    amount: 620,
    description: 'Year-end sale haul',
    date: '2025-12-12',
    createdAt: '2025-12-12T14:00:00Z',
  },
  {
    id: '25',
    type: 'income',
    category: 'Investment',
    amount: 450,
    description: 'Unit trust distribution',
    date: '2025-12-15',
    createdAt: '2025-12-15T09:00:00Z',
  },
  {
    id: '26',
    type: 'expense',
    category: 'Food',
    amount: 340,
    description: 'Holiday dinners & groceries',
    date: '2025-12-20',
    createdAt: '2025-12-20T18:00:00Z',
  },

  // ── November 2025 ─────────────────────────────────────────────
  {
    id: '27',
    type: 'income',
    category: 'Salary',
    amount: 5200,
    description: 'Monthly salary — November 2025',
    date: '2025-11-01',
    createdAt: '2025-11-01T09:00:00Z',
  },
  {
    id: '28',
    type: 'expense',
    category: 'Housing',
    amount: 1500,
    description: 'Rent payment — November',
    date: '2025-11-02',
    createdAt: '2025-11-02T10:00:00Z',
  },
  {
    id: '29',
    type: 'expense',
    category: 'Healthcare',
    amount: 250,
    description: 'Annual health screening',
    date: '2025-11-10',
    createdAt: '2025-11-10T11:00:00Z',
  },
  {
    id: '30',
    type: 'income',
    category: 'Freelance',
    amount: 650,
    description: 'Social media content project',
    date: '2025-11-18',
    createdAt: '2025-11-18T16:00:00Z',
  },
  {
    id: '31',
    type: 'expense',
    category: 'Food',
    amount: 275,
    description: 'Groceries & eating out',
    date: '2025-11-22',
    createdAt: '2025-11-22T14:00:00Z',
  },

  // ── October 2025 ──────────────────────────────────────────────
  {
    id: '32',
    type: 'income',
    category: 'Salary',
    amount: 5000,
    description: 'Monthly salary — October 2025',
    date: '2025-10-01',
    createdAt: '2025-10-01T09:00:00Z',
  },
  {
    id: '33',
    type: 'expense',
    category: 'Housing',
    amount: 1500,
    description: 'Rent payment — October',
    date: '2025-10-02',
    createdAt: '2025-10-02T10:00:00Z',
  },
  {
    id: '34',
    type: 'expense',
    category: 'Transport',
    amount: 200,
    description: 'Road trip fuel & toll',
    date: '2025-10-08',
    createdAt: '2025-10-08T09:00:00Z',
  },
  {
    id: '35',
    type: 'expense',
    category: 'Education',
    amount: 350,
    description: 'AWS certification exam',
    date: '2025-10-15',
    createdAt: '2025-10-15T10:00:00Z',
  },
  {
    id: '36',
    type: 'expense',
    category: 'Food',
    amount: 260,
    description: 'Groceries & café',
    date: '2025-10-20',
    createdAt: '2025-10-20T14:00:00Z',
  },
]
