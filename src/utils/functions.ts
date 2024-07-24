import { ITransaction } from "./interface"

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

export function agruparPorMes(array: ITransaction[]): { [key: string]: ITransaction[] } {
  return array.reduce((acc, obj) => {
    const mes = obj.datetransaction.split('/')[1];
    if (!acc[mes]) {
      acc[mes] = [];
    }
    acc[mes].push(obj);
    return acc;
  }, {} as { [key: string]: ITransaction[] });
}

export interface GroupedData {
  month: string;
  totals: { [tipo: string]: number };
}

export function groupByMonthAndSumByType(data: ITransaction[]): GroupedData[] {
  const result: { [month: string]: { [tipo: string]: number } } = {};

  data.forEach(item => {
    const month = item.datetransaction.split('/')[1];

    if (!result[month]) {
      result[month] = {};
    }

    if (!result[month][item.modality]) {
      result[month][item.modality] = 0;
    }

    result[month][item.modality] += item.price;
  });

  return Object.keys(result).map(month => ({
    month,
    totals: result[month],
  }));
}
