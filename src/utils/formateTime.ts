function formatUTCWithMs(date: Date) {
  function parse(number: number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  function parseMs(number: number) {
    if (number < 10) {
      return '00' + number;
    } else if (number < 100) {
      return '0' + number;
    }
    return number;
  }

  return (
    date.getUTCFullYear() +
    '-' +
    parse(date.getUTCMonth() + 1) +
    '-' +
    parse(date.getUTCDate()) +
    ' ' +
    parse(date.getUTCHours()) +
    ':' +
    parse(date.getUTCMinutes()) +
    ':' +
    parse(date.getUTCSeconds()) +
    ' .' +
    parseMs(date.getUTCMilliseconds()) +
    'Z'
  );
}

export default formatUTCWithMs;
