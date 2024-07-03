import CardResume from "@aw/components/card/cardResume";
import LastRecords from "@aw/components/LastRecords";
import Chart from "@aw/components/ui/chart";

export default function Dashboard() {
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

  const dataList = [
    {
      id: 1,
      name: 'Osmair',
      product: 'Bombom',
      amount: 2,
      price: 10.00
    },
    {
      id: 2,
      name: 'Wanessa',
      product: 'Barra Recheada',
      amount: 2,
      price: 12.00
    },
    {
      id: 3,
      name: 'Jose',
      product: 'Bombom',
      amount: 3,
      price: 15.00
    },
  ]

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
        <CardResume
          title="Vendas"
          price={999.99}
          period="De 99/99/9999 a 99/99/9999"
          icon="+"
        />
        <CardResume
          title="Compras"
          price={99.99}
          period="De 99/99/9999 a 99/99/9999"
          icon="-"
        />
        <CardResume
          title="Saldo"
          price={999.99}
          period="De 99/99/9999 a 99/99/9999"
        />
      </section>

      <section className="flex flex-row flex-wrap justify-start w-full h-[300px] my-4 gap-4">
        <div className="p-4 w-96 h-72 lg:w-[600px] lg:h-[350px] border-[1px] border-slate-200 shadow-xl hover:shadow-lg transition-all rounded-lg">
          <Chart data={dataChart} />
        </div>
        <div className="p-4 w-96 h-72 lg:w-[500px] lg:h-[350px] border-[1px] border-slate-200 shadow-xl hover:shadow-lg transition-all rounded-lg">
          <LastRecords data={dataList} />
        </div>
      </section>
    </div>
  )
}