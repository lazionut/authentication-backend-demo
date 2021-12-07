const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore({
	projectId: 'fsdscheduler',
	keyFilename: 'datastore-credentials.json'
});
const kindName = 'user-log';

exports.savelog = (req, res) => {
	let uid = req.query.uid || req.body.uid || 0;
	let log = req.query.log || req.body.log || '';

	datastore
		.save({
			key: datastore.key(kindName),
			data: {
				log: log,
				uid: datastore.int(uid),
				time_create: datastore.int(Math.floor(new Date().getTime()/1000))
			}
		})
		.catch(err => {
		    console.error('ERROR:', err);
		    res.status(200).send(err);
		    return;
		});

	res.status(200).send(log);
};

//https://us-central1-fsdscheduler.cloudfunctions.net/savelog?log=we_did_it_bois&uid=1
//gcloud functions deploy savelog --entry-point savelog --runtime nodejs14 --trigger-http --allow-unauthenticated --project fsdscheduler