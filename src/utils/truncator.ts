export default function truncator(value: string) {
  if (!value) return '';

  const MAX_LENGTH = 2000;
  const length = value.length;

  if (length <= MAX_LENGTH) {
    return value;
  }

  try {
    // Разбиваем текст по строкам
    const lines = value.split('\n');
    let result = '';
    let currentLength = 0;

    // Собираем строки, пока не достигнем максимальной длины
    for (const line of lines) {
      const lineWithNewline = line + '\n';
      if (currentLength + lineWithNewline.length > MAX_LENGTH) {
        break;
      }
      result += lineWithNewline;
      currentLength += lineWithNewline.length;
    }

    // Если результат все еще слишком длинный, обрезаем его
    if (result.length > MAX_LENGTH) {
      result = result.substring(0, MAX_LENGTH);
    }

    return result;
  } catch (error) {
    console.error('Error in truncator:', error);
    // В случае ошибки возвращаем пустую строку
    return '';
  }
}
