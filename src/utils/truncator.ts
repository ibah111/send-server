export default function truncator(value: string) {
  const length = value.length;
  if (length >= 2000) {
    let sum_length: number = 100;
    const arr = value.split('\n');
    const split_arr = arr.reduce((prev, curr) => prev + `${curr}`);
    const over_length = split_arr.length;
    const total_minus_length = over_length + 100 - 2000;
    for (let i = 0; sum_length <= total_minus_length; i++) {
      const item = arr[i];
      sum_length += item.length;
    }
    const a = split_arr.slice(sum_length);
    console.log(`a.length: ${a.length}`, 'truncator value: ', a);
    if (a.length >= 2000) {
      console.log('values ', a);
      throw Error('Укоротите сообщение');
    } else return a;
  } else return value;
}
