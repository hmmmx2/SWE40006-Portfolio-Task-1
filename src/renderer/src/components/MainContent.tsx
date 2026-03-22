import { Transaction } from '../data/sampleData'
import type { ActiveView, FilterType } from '../App'
import Dashboard from './Dashboard'
import TransactionList from './TransactionList'
import AddTransactionForm from './AddTransactionForm'

interface MainContentProps {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
  transactions: Transaction[]
  filterType: FilterType
  setFilterType: (f: FilterType) => void
  filterCategory: string
  setFilterCategory: (c: string) => void
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void
  deleteTransaction: (id: string) => void
}

export default function MainContent({
  activeView,
  setActiveView,
  transactions,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  addTransaction,
  deleteTransaction,
}: MainContentProps): React.JSX.Element {
  return (
    <main className="flex-1 overflow-y-auto bg-app">
      {activeView === 'dashboard' && (
        <Dashboard
          transactions={transactions}
          setActiveView={setActiveView}
          deleteTransaction={deleteTransaction}
        />
      )}
      {activeView === 'transactions' && (
        <TransactionList
          transactions={transactions}
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          deleteTransaction={deleteTransaction}
        />
      )}
      {activeView === 'add' && (
        <AddTransactionForm
          addTransaction={addTransaction}
          onCancel={() => setActiveView('dashboard')}
        />
      )}
    </main>
  )
}
