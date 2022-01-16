const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore({
  projectId: "fsdscheduler",
  keyFilename: "datastore-credentials.json",
});

//const kindName = "user-log";

/*exports.savelog = (req, res) => {
  let uid = req.query.uid || req.body.uid || 0;
  let log = req.query.log || req.body.log || "";

  datastore
    .save({
      key: datastore.key(kindName),
      data: {
        log: log,
        uid: datastore.int(uid),
        time_create: datastore.int(Math.floor(new Date().getTime() / 1000)),
      },
    })
    .catch((err) => {
      console.error("ERROR:", err);
      res.status(500).send(err);
      return;
    });

  res.status(200).send(log);
};*/

const dateKindName = "Schedule";

/* https://us-central1-fsdscheduler.cloudfunctions.net/saveDateInterval
POST a JSON*/

exports.saveDateInterval = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  }

  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  if (!startDate && !endDate) {
    res.status(500).send("ERROR: Start date and end date must be specified!");
    return;
  } else if (startDate < 1 || startDate > 31 || endDate < 1 || endDate > 31) {
    res
      .status(500)
      .send(
        "ERROR: Start date/end date are exceeding the minimum/maximum days!"
      );
    return;
  } else if (startDate > endDate) {
    res.status(500).send("ERROR: Start date must be smaller than end date!");
    return;
  }

  await datastore
    .save({
      key: datastore.key(dateKindName),
      data: {
        startDate: datastore.int(startDate),
        endDate: datastore.int(endDate),
      },
    })
    .then(() => {
      res.status(200).send("Date interval succesfully added");
    })
    .catch((err) => {
      console.error("ERROR:", err);
      res.status(500).send(err);
      return;
    });
};

/* https://us-central1-fsdscheduler.cloudfunctions.net/getDateInterval
GET without any parameters*/

exports.getDateInterval = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  }

  const query = datastore.createQuery(dateKindName);

  datastore
    .runQuery(query)
    .then((intervals) => {
      res.status(200).send(intervals[0]);
    })
    .catch((err) => {
      console.error("ERROR:", err);
      res.status(500).send(err);
      return;
    });
};

//gcloud functions deploy savelog --entry-point savelog --runtime nodejs14 --trigger-http --allow-unauthenticated --project fsdscheduler
