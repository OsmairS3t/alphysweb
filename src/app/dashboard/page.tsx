'use client'
import { useEffect, useState } from "react";
import CardResume from "@aw/components/card/cardResume";
import LastRecords from "@aw/components/LastRecords";
import Chart from "@aw/components/ui/chart";
import { supabase } from "@aw/lib/database";
import { IBuy, IChartData, ISale, IResumeTransaction } from "@aw/utils/interface";

export default function Dashboard() {
  const [transaction, setTransaction] = useState<IResumeTransaction[]>([])
  const [chartData, setChartData] = useState<IChartData[]>([])
  const [listSales, setListSales] = useState<ISale[]>([])

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
    const { data } = await supabase.from('sales').select('*').order('datesale', {ascending: false})
    if (data) {
      setListSales(data)
    }
  }
  
  async function loadTransactionsByMonth() {
    let buys: IBuy[] = []
    let sales: ISale[] = []
    const responseBuy = await supabase.from('buys').select('*')
    if (responseBuy.data) {
      buys = responseBuy.data
    }

    const responseSale = await supabase.from('sales').select('*')
    if (responseSale.data) {
      sales = responseSale.data
    }
  }
  
  async function loadTransactions() {
    let buys: IBuy[] = []
    let sales: ISale[] = []
    let sumBuy = 0
    let sumSale = 0
    let dateBuyIni = ''
    let dateBuyEnd = ''
    let dateSaleIni = ''
    let dateSaleEnd = ''
    const responseBuy = await supabase.from('buys').select('*').order('datebuy')
    if (responseBuy.data) {
      buys = responseBuy.data
    }
    const responseSale = await supabase.from('sales').select('*').order('datesale')
    if (responseSale.data) {
      sales = responseSale.data
    }
    dateBuyIni = buys[0].datebuy
    dateBuyEnd = buys[buys.length -1].datebuy
    buys.map(item => {
      sumBuy += item.price
    })
    dateSaleIni = sales[0].datesale
    dateSaleEnd = sales[sales.length -1].datesale
    sales.map(item => {
      sumSale += item.price
    })
    
    const chartTemp:IChartData[] = [
      {
        name: 'Junho',
        compras: 3000,
        vendas: 1398,
        saldo: 2210,
      }
    ]
    setChartData(chartTemp)

    const transactionTemp:IResumeTransaction[] = [
      {
        title: 'Vendas',
        price: String(sumSale),
        period: 'De '+ dateSaleIni +' a '+ dateSaleEnd,
        icon: '+',
      },
      {
        title: 'Compras',
        price: String(sumBuy),
        period: 'De '+ dateBuyIni +' a '+ dateBuyEnd,
        icon: '-',
      },
      {
        title: 'Saldo',
        price: String(sumSale - sumBuy),
        period: 'De '+ dateBuyIni +' a '+ dateBuyEnd,
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
        <h1 className="font-bold text-2xl text-black">Titulo Dashboard</h1>
        <div>
          <select className="border-[1px] border-slate-500 rounded-lg p-2">
            <option value="data">02/07/2024</option>
          </select>
        </div>
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

      <section className="flex flex-row flex-wrap justify-start w-full h-[300px] my-4 gap-4">
        <div className="p-4 w-96 h-72 lg:w-[600px] lg:h-[350px] border-[1px] border-slate-200 shadow-xl hover:shadow-lg transition-all rounded-lg">
          <Chart data={dataChart} />
        </div>
        <div className="p-4 w-96 h-72 lg:w-[500px] lg:h-[350px] border-[1px] border-slate-200 shadow-xl hover:shadow-lg transition-all rounded-lg">
          <LastRecords data={listSales} />
        </div>
      </section>
    </div>
  )
}
