let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
exports.handler = function (event, context, callback) {
	
	ddb.get({
		TableName: 'children',
		Key: { 'id': event['childrenid'] }
	}, function (err, data) {
		if (err) {
			console.log(err)
		} else {
			let receiver = data['Item']['phone'];
			let sender = 'Your Lost Children';
			let message = 'Ive found your children';

		}
	});

	console.log("Sending message", message, "to receiver", receiver);
	sns.publish({
		Message: message,
		MessageAttributes: {
			'AWS.SNS.SMS.SMSType': {
				DataType: 'String',
				StringValue: 'Promotional'
			},
			'AWS.SNS.SMS.SenderID': {
				DataType: 'String',
				StringValue: sender
			},
		},
		PhoneNumber: receiver
	}).promise()
		.then(data => {
			console.log("Sent message to", receiver);
			callback(null, data);
		})
		.catch(err => {
			console.log("Sending failed", err);
			callback(err);
		});

	callback(null, 'Successfully executed');
}