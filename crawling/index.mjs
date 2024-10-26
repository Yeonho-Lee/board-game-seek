import { writeFileSync } from 'fs';
import convert from 'xml-js';

const ids = [13];

for await (const id of ids) {
	const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`);
	if (!response.ok) {
		console.error(`Fetching ${id} failed.`);
		break; // API 리밋 걸렸을 수 있음. 추가 호출 중단
	}
	writeFileSync(
		`${id}.json`,
		convert.xml2json(await response.text(), { compact: false, spaces: 2 }),
	);
}
