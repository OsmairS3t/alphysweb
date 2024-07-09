export function MonthForNumber(numberMonth: string) {
  switch(numberMonth) {
    case '01':
      return 'Janeiro'
      case '02':
      return 'Fevereiro'
      case '03':
      return 'Março'
      case '04':
      return 'Abril'
      case '05':
      return 'Maio'
      case '06':
      return 'Junho'
      case '07':
      return 'Julho'
      case '08':
      return 'Agosto'
      case '09':
      return 'Setembro'
      case '10':
      return 'Outubro'
      case '11':
      return 'Novembro'
      case '12':
      return 'Dezembro'
    default:
      return 'Não encontrado'
  }
}

interface DataObject {
  dt: string; // data no formato 'dd/mm/aaaa'
  // outros campos...
}

const array: DataObject[] = [
  { dt: '01/01/2023' },
  { dt: '10/05/2022' },
  { dt: '07/07/2023' },
  { dt: '25/11/2021' },
  { dt: '15/07/2023' },
];

export function agruparPorMes(array: DataObject[]): { [key: string]: DataObject[] } {
  return array.reduce((acc, obj) => {
    const mes = obj.dt.split('/')[1]; // Extrai o mês da data
    if (!acc[mes]) {
      acc[mes] = [];
    }
    acc[mes].push(obj);
    return acc;
  }, {} as { [key: string]: DataObject[] });
}