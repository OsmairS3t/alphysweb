'use client'
import { useEffect, useState } from "react";
import CardResume from "@aw/components/card/cardResume";
import LastRecords from "@aw/components/LastRecords";
import Chart from "@aw/components/ui/chart";
import { supabase } from "@aw/lib/database";
import { IChartData, IResumeTransaction, ITransaction } from "@aw/utils/interface";
import { GroupedData, MonthForNumber, agruparPorMes, groupByMonthAndSumByType } from "@aw/utils/functions";

export default function Dashboard() {
  const [transaction, setTransaction] = useState<IResumeTransaction[]>([])
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [chartData, setChartData] = useState<IChartData[]>([])
  const [listSales, setListSales] = useState<ITransaction[]>([])

  const dataChart = [
    {
      name: 'Maio',
      compras: 4000,
      vendas: 2400,
      saldo: 2400,
    },
    {
      name: 'Junho',
      compras: 3000,
      vendas: 1398,
      saldo: 2210,
    },
  ];

  async function loadSales() {
    const { data } = await supabase.from('transactions').select('*').eq('modality', 'sale').order('datetransaction', { ascending: false })
    if (data) {
      setListSales(data)
    }
  }

  async function loadTransactions() {
    let buys: ITransaction[] = []
    let sales: ITransaction[] = []
    let sumBuy = 0
    let sumSale = 0
    let dateBuyIni = ''
    let dateBuyEnd = ''
    let dateSaleIni = ''
    let dateSaleEnd = ''
    let chartTemp: IChartData[] = []
    let transactionChart: GroupedData[] = []
    const { data } = await supabase.from('transactions').select('*').order('datetransaction')
    if (data) {
      buys = data.filter(item => item.modality === 'buy')
      sales = data.filter(item => item.modality === 'sale')
      transactionChart = groupByMonthAndSumByType(data)
      dateBuyIni = buys[0].datetransaction
      dateBuyEnd = buys[buys.length - 1].datetransaction
    }
    buys.map(item => {
      sumBuy += item.price
    })
    dateSaleIni = sales[0].datetransaction
    dateSaleEnd = sales[sales.length - 1].datetransaction
    sales.map(item => {
      sumSale += item.price
    })

    for (let index = 0; index < transactionChart.length; index++) {
      let c = transactionChart[index].totals.buy
      let v = transactionChart[index].totals.sale
      let s = (Number(transactionChart[index].totals.sale) - Number(transactionChart[index].totals.buy))
      chartTemp.push({
        name: MonthForNumber(transactionChart[index].month),
        compras: Number(c > 0 ? c.toFixed(2) : 0),
        vendas: Number(v > 0 ? c.toFixed(2) : 0),
        saldo: Number(s > 0 ? c.toFixed(2) : 0)
      })
    }
    setChartData(chartTemp)

    const transactionTemp: IResumeTransaction[] = [
      {
        title: 'Vendas',
        price: String(sumSale),
        period: 'De ' + dateSaleIni + ' a ' + dateSaleEnd,
        icon: '+',
      },
      {
        title: 'Compras',
        price: String(sumBuy),
        period: 'De ' + dateBuyIni + ' a ' + dateBuyEnd,
        icon: '-',
      },
      {
        title: 'Saldo',
        price: String(sumSale - sumBuy),
        period: 'De ' + dateBuyIni + ' a ' + dateBuyEnd,
        icon: '',
      }
    ]
    setTransaction(transactionTemp)
  }

  useEffect(() => {
    loadSales()
    loadTransactions()
  }, [])

  return (
    <div className="flex flex-col gap-8 justify-center">
      <section className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-2xl text-black">Alpys Chocolateria</h1>
      </section>
      <section className="flex flex-row flex-wrap w-96 lg:w-full justify-center gap-8">
        {
          transaction.map(item => (
            <CardResume
              key={item.title}
              title={item.title}
              price={Number(item.price)}
              period={item.period}
              icon={item.icon}
            />
          ))
        }
      </section>

      <section className="flex flex-row flex-wrap justify-start my-4 gap-4">
        <div className="p-4 w-96 h-72 lg:w-[700px] lg:h-[600px] border-[1px] border-slate-200 shadow-xl hover:shadow-lg transition-all rounded-lg">
          <Chart data={chartData} />
        </div>
        <div className="p-4 w-96 h-72 lg:w-[600px] lg:h-auto border-[1px] border-slate-200 shadow-xl hover:shadow-lg transition-all rounded-lg">
          <LastRecords data={listSales} />
        </div>
      </section>
    </div>
  )
}
