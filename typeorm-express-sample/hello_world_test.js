const assert = require('assert');
const {exec} = require('child_process');
const {request} = require('gaxios');
const uuid = require('uuid');
const waitPort = require('wait-port');

const PORT = process.env.PORT || 8080;
const BASE_URL = `http://localhost:${PORT}`;

  let ffProc;

  // Run the functions-framework instance to host functions locally
  before(async () => {
    ffProc = exec(
      `npx functions-framework --target=helloHttp --signature-type=http --port ${PORT}`
    );
    await waitPort({host: 'localhost', port: PORT});
  });

  after(() => ffProc.kill());

  it('helloHttp: should print a name', async () => {
    const name = uuid.v4();

    const response = await request({
      url: `${BASE_URL}/helloHttp`,
      method: 'POST',
      data: {name},
    });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data, `Hello ${name}!`);
  });