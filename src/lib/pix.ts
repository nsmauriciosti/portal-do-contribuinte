function crc16(payload: string): string {
  let polynomial = 0x1021;
  let result = 0xFFFF;
  if (payload.length > 0) {
    for (let offset = 0; offset < payload.length; offset++) {
      result ^= (payload.charCodeAt(offset) << 8);
      for (let bitwise = 0; bitwise < 8; bitwise++) {
        if ((result <<= 1) & 0x10000) result ^= polynomial;
        result &= 0xFFFF;
      }
    }
  }
  return result.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload(chave: string, nome: string, cidade: string, valor: string): string {
  const pad = (id: string, value: string) => `${id}${value.length.toString().padStart(2, '0')}${value}`;
  
  const gui = pad('00', 'br.gov.bcb.pix');
  const key = pad('01', chave);
  const merchantAccountInfo = pad('26', gui + key);
  
  const merchantCategoryCode = pad('52', '0000');
  const transactionCurrency = pad('53', '986');
  const transactionAmount = valor ? pad('54', valor) : '';
  const countryCode = pad('58', 'BR');
  const merchantName = pad('59', nome.substring(0, 25));
  const merchantCity = pad('60', cidade.substring(0, 15));
  
  const txid = pad('05', '***');
  const additionalDataField = pad('62', txid);
  
  const payload = '000201' + merchantAccountInfo + merchantCategoryCode + transactionCurrency + transactionAmount + countryCode + merchantName + merchantCity + additionalDataField + '6304';
  
  return payload + crc16(payload);
}
