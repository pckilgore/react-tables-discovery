const uuid = require("uuid4");

const DATE_MIN = 1450000000000; // "2015-12-03T15:06:40.000Z"
const DATE_RANGE = 100000000000;

export const dummyData = Array(20)
  .fill(0)
  .reduce((data, key, idx) => {
    return [
      {
        id: uuid(),
        name: `Fake Tag ${idx + 1}`,
        created: new Date(
          DATE_MIN + Math.floor(Math.random() * DATE_RANGE)
        ).toISOString(),
        contacts: Math.floor(Math.random() * 20)
      },
      ...data
    ];
  }, {});

