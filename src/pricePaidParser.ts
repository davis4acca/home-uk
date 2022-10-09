export enum PricePaidColumns {
  id,
  price,
  date,
  postcode,
  property_type,
  old,
  duration,
  primary_name, // for example, the house number or name
  secondary_name, // for example, flat number
  street,
  locality,
  town,
  district,
  county
}

export type PricePaidRecord = [
  string,
  number,
  Date,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

const textDecoder = new TextDecoder();

export async function parseStream(stream: ReadableStream<Uint8Array>): Promise<PricePaidRecord[]> {
  const reader = stream.getReader();
  let remainder = '';
  const records: PricePaidRecord[] = [];
  for (; ;) {
    const result = await reader.read();
    if (result.done) {
      break;
    }
    const chunk = remainder + textDecoder.decode(result.value);
    const lastLineBreak = chunk.lastIndexOf('\n');
    remainder = lastLineBreak === chunk.length - 1 ? '' : chunk.substring(lastLineBreak);
    const chunkLines = chunk.split('\n');
    chunkLines.pop(); // the last line is either the remainder or an empty string
    const chunkRecords: PricePaidRecord[] = chunkLines.map(line => {
      const columns = line.split(',').slice(0, -2);
      return columns.map((quotedColumn, i) => {
        const column = quotedColumn.length >= 2 ? quotedColumn.slice(1, -1) : '';
        switch (i) {
          case PricePaidColumns.price:
            return parseInt(column, 10);
          case PricePaidColumns.date:
            return new Date(column);
          default:
            return column;
        }
      }) as PricePaidRecord;
    });
    // Mutating records with splice is faster than using concat and reassigning.
    records.splice(records.length, 0, ...chunkRecords);
  }

  return records;
}