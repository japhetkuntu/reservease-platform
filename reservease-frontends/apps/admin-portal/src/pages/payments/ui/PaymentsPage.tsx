import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign, Download, TrendingUp,
  ArrowUpRight, ArrowDownRight, Wallet, Receipt,
  CheckCircle2, Clock, AlertCircle, MoreHorizontal, Trash2
} from 'lucide-react'
import { MOCK_TRANSACTIONS } from '@/data/payments'
import { Button } from '@/components/ui/button'
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PaymentsPage() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handleRefund = (id: string | number) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: 'Refunded' } : tx));
  };

  const deleteTransaction = (id: string | number) => {
     setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <div className="relative min-h-screen">
      <PulseBackground />
      
      <div className="relative z-10 space-y-8 pb-20">
        <div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/50"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground leading-none">
              Payments
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-2">Manage transactions and payouts.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-12 px-6 rounded-lg border-border/50 bg-card font-semibold uppercase tracking-wide text-xs">
                <Download className="mr-2 h-4 w-4" /> Export
             </Button>
             <Button className="h-12 px-6 rounded-lg font-semibold uppercase tracking-wide text-xs">
                <DollarSign className="mr-2 h-4 w-4" /> Payout
             </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
           <FinanceCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Gross Revenue"
              value="₵45,230.00"
              change="+12.5%"
              trend="up"
              color="primary"
              index={0}
           />
           <FinanceCard
              icon={<Wallet className="h-5 w-5" />}
              label="Pending Payouts"
              value="₵12,450.00"
              change="+2.4%"
              trend="up"
              color="amber"
              index={1}
           />
           <FinanceCard
              icon={<Receipt className="h-5 w-5" />}
              label="Service Fees"
              value="₵2,105.50"
              change="-1.2%"
              trend="down"
              color="emerald"
              index={2}
           />
        </div>

        <div 
          className="rounded-lg border border-border/50 bg-card overflow-hidden"
        >
          <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
             <h3 className="text-base font-bold tracking-tight">Transactions</h3>
             <Badge variant="outline" className="rounded-lg border-border/50 font-semibold uppercase tracking-wide text-xs">Recent</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/20 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs text-muted-foreground">ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Property</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Type</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-right font-semibold uppercase tracking-wide text-xs text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-semibold uppercase tracking-wide text-xs">Loading transactions...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-semibold uppercase tracking-wide text-xs">No transactions found.</td></tr>
                ) : transactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground text-sm">{tx.propertyName}</div>
                      <div className="text-xs text-muted-foreground">{tx.tenantName}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border/50">{tx.type}</span>
                    </td>
                    <td className="px-6 py-4 text-base font-bold text-foreground">
                       ₵{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={tx.status === 'Successful' ? 'default' : tx.status === 'Pending' ? 'secondary' : 'destructive'}
                        className="rounded-full px-3 py-1 font-semibold uppercase tracking-wide text-xs"
                      >
                        {tx.status === 'Successful' ? <CheckCircle2 className="h-3 w-3 mr-2 inline" /> : tx.status === 'Pending' ? <Clock className="h-3 w-3 mr-2 inline" /> : <AlertCircle className="h-3 w-3 mr-2 inline" />}
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted">
                                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-lg bg-card border-border/50 shadow-lg p-1">
                               <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-3 py-2">Actions</DropdownMenuLabel>
                               <DropdownMenuItem className="cursor-pointer rounded h-9 font-semibold px-3 focus:bg-muted">
                                  <Receipt className="mr-2 h-4 w-4" /> View Receipt
                               </DropdownMenuItem>
                               <DropdownMenuItem className="cursor-pointer rounded h-9 font-semibold px-3 focus:bg-muted" onClick={() => deleteTransaction(tx.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                               </DropdownMenuItem>
                               <DropdownMenuSeparator className="my-1 opacity-50" />
                               <DropdownMenuItem className="text-rose-600 focus:bg-rose-500/10 cursor-pointer rounded h-9 font-semibold px-3" onClick={() => handleRefund(tx.id)}>
                                  <AlertCircle className="mr-2 h-4 w-4" /> Refund
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function FinanceCard({ icon, label, value, change, trend, color, index }: any) {
  const colorMap: any = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-700",
    emerald: "bg-emerald-500/10 text-emerald-700"
  };

  return (
    <div 
      className="p-6 border border-border/50 bg-card rounded-lg hover:bg-card/80 transition-colors"
    >
       <div className={`inline-flex p-3 rounded-lg mb-4 ${colorMap[color]}`}>
          {icon}
       </div>
       <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
       <div className="flex items-center justify-between">
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          <span className={`text-xs font-semibold flex items-center ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {change}
            {trend === 'up' ? <ArrowUpRight className="ml-1 h-3 w-3" /> : <ArrowDownRight className="ml-1 h-3 w-3" />}
          </span>
       </div>
    </div>
  );
}
