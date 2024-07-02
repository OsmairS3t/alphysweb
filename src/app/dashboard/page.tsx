export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-row flex-wrap gap-8">
        <aside className="flex flex-col gap-2">
          <h2>VENDAS</h2>
          <div className="w-96 h-72 bg-lime-100 border-2 border-lime-200 shadow-md hover:shadow-lime-600 rounded-lg">

          </div>
        </aside>

        <aside className="flex flex-col gap-2">
          <h2>VENDAS POR PERÍODO</h2>
          <div className="w-96 h-72 bg-green-100 border-2 border-green-200 shadow-md hover:shadow-green-600 rounded-lg">
          </div>
        </aside>
      </section>

      <section className="flex flex-row flex-wrap gap-8">
        <aside className="flex flex-col gap-2">
          <h2>COMPRAS</h2>
          <div className="w-96 h-72 bg-orange-100 border-2 border-orange-200 shadow-md hover:shadow-orange-600 rounded-lg">
          </div>
        </aside>
      </section>
    </div>
  )
}