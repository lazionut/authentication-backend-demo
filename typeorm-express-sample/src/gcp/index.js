const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore({
  projectId: "fsdscheduler",
  keyFilename: "datastore-credentials.json",
});
const kindName = "user-log";
const dateKindName = "Schedule";

exports.savelog = (req, res) => {
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
};

exports.saveDateInterval = async (req, res) => {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;

  if (startDate < endDate) {
    datastore
      .save({
        key: datastore.key(dateKindName),
        data: {
          startDate: datastore.int(startDate),
          endDate: datastore.int(endDate),
        },
      })
      .catch((err) => {
        console.error("ERROR:", err);
        res.status(500).send(err);
        return;
      });

    res.status(200).send("Date interval succesfully added");
  }

  res.status(500).send("ERROR: Start date must be smaller than end date!");
  return;
};

exports.getDateInterval = async () => {
  const allSchedulesQuery = datastore.createQuery("Schedule").order();

  datastore
    .runQuery(allSchedulesQuery)
    .then((res) => {
      const schedules = res[0];

      console.log("Schedules:");
      schedules.forEach((schedule) => {
        const scheduleKey = schedule[datastore.KEY];
		//for testing
        console.log(scheduleKey.id, schedule);
      });
    })
    .catch((err) => {
      console.error("ERROR:", err);
	  res.status(500).send(err);
	  return;
    });

	res.status(200);
};

//https://us-central1-fsdscheduler.cloudfunctions.net/savelog?log=we_did_it_bois&uid=1
//gcloud functions deploy savelog --entry-point savelog --runtime nodejs14 --trigger-http --allow-unauthenticated --project fsdscheduler
