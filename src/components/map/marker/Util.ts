import numeral from 'numeral'

export const sortData = (data: any) => {
  const sortedData = [...data]

  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1))
}

export const prettyProntStat = (stat: any) =>
  stat ? `+${numeral(stat).format('0.0a')}` : '+0'
