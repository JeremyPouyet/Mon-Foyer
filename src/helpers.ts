import { all, create, } from 'mathjs'
import { v4 as uuidv4 } from 'uuid'

import { frequencies, Frequency, TransactionType } from './types'
import type { ID, Transaction } from './types'
import { computed, type Ref } from 'vue'
import type Account from './account'
import type User from './user'

// https://mathjs.org/docs/expressions/security.html
const math = create(all)
const limitedEvaluate = math.evaluate.bind(math)

export { limitedEvaluate }

math.import({
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') },
  'evaluate':   function () { throw new Error('Function evaluate is disabled') },
  'import':     function () { throw new Error('Function import is disabled') },
  'parse':      function () { throw new Error('Function parse is disabled') },
  'simplify':   function () { throw new Error('Function simplify is disabled') },
}, { override: true })

export function round(value: number) : number {
  return math.round(value, 2)
}

type Multipliers = {
  [key in Frequency]: {
    [key in Frequency]?: number
  }
}

const multipliers : Multipliers = {
  [Frequency.monthly]:   { [Frequency.quarterly]: 3,  [Frequency.biannual]: 6,    [Frequency.yearly]: 12 },
  [Frequency.quarterly]: { [Frequency.monthly]: 1/3,  [Frequency.biannual]: 2,    [Frequency.yearly]: 4 },
  [Frequency.biannual]:  { [Frequency.monthly]: 1/6,  [Frequency.quarterly]: 1/2, [Frequency.yearly]: 2 },
  [Frequency.yearly]:    { [Frequency.monthly]: 1/12, [Frequency.quarterly]: 1/4, [Frequency.biannual]: 1/2 }
}

/**
 * Gets a Transaction value as another frequency than the one inside the Transaction
 * @param transaction
 * @param asFrequency
 * @returns
 */
export function valueAs(transaction: Pick<Transaction, 'value' | 'frequency'>, asFrequency: Frequency = Frequency.monthly) : number {
  const value = limitedEvaluate(transaction.value.toString()) as number
  return value * (multipliers[transaction.frequency][asFrequency] ?? 1)
}

export function newId() : ID {
  // only available with https
  // return crypto.randomUUID()
  return uuidv4() as ID
}

export function useTransactions(accountRef: Ref<Account>, transactionTypeRef: Ref<TransactionType>) {
  const transactionList = computed(() => accountRef.value.transactionSorted(transactionTypeRef.value))

  const totals = computed<number[]>(() =>
    frequencies.map(frequency =>
      round(transactionList.value.values.reduce((sum, transaction) => sum + valueAs(transaction, frequency), 0))
    )
  )

  return { totals, transactionList }
}

export function useFinanceCalculations(account: Ref<Account>, users: Ref<User[]>) {
  return {
    commonBill: computed(() => Math.max(account.value.expenses.sum - account.value.incomes.sum, 0)),
    incomeSum:  computed(() => users.value.reduce((sum, user) => sum + user.account.incomes.sum, account.value.incomes.sum)),
    remainSum:  computed(() => users.value.reduce((sum, user) => sum + (user.account.incomes.sum - user.account.expenses.sum), 0))
  }
}