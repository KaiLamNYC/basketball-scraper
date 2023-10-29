const axios = require("axios");
const cheerio = require("cheerio");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function fetchUpdates() {
	try {
		const response = await axios.get(
			"https://www.rotowire.com/basketball/news.php?view=all"
		);
		const $ = cheerio.load(response.data);
		const updates = [];
		$(".news-update").each((i, element) => {
			// const playerLink = $(element)
			// 	.find(".news-update__player-link")
			// 	.attr("href");
			const playerName = $(element).find(".news-update__player-link").text();
			const headline = $(element).find(".news-update__headline").text();
			const positionTeam =
				$(element).find(".news-update__pos").text() +
				$(element)
					.find(".news-update__meta div:not(:has(.news-update__pos))")
					.text();
			const date = $(element).find(".news-update__timestamp").text();
			const news = $(element).find(".news-update__news").text();
			// const analysisLink = $(element)
			// 	.find(".news-update__analysis a")
			// 	.attr("href");

			const update = {
				playerName,
				// playerLink,
				headline,
				positionTeam,
				date,
				news,
				// analysisLink,
			};
			updates.push(update);
		});
		return updates;
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}

async function formatUpdates() {
	const updates = await fetchUpdates();
	let formattedUpdates = "";
	updates.forEach((update) => {
		formattedUpdates += `Player: ${update.playerName}\n`;
		// formattedUpdates += `Profile Link: ${update.playerLink}\n`;
		formattedUpdates += `Headline: ${update.headline}\n`;
		formattedUpdates += `Position & Team & Injury: ${update.positionTeam}\n`;
		formattedUpdates += `Date: ${update.date}\n`;
		formattedUpdates += `News: ${update.news}\n`;
		// formattedUpdates += `Analysis Link: ${update.analysisLink}\n`;
		formattedUpdates += "-----\n"; // Separator between updates
	});
	return formattedUpdates;
}

// async function sendEmail(formattedUpdates) {
// 	const msg = {
// 		to: "kailam633@gmail.com", // Change to your recipient
// 		from: "kailamnyc@gmail.com", // Change to your verified sender
// 		subject: "Player Updates",
// 		text: formattedUpdates, // Use your formatted updates text here
// 		html: `<pre>${formattedUpdates}</pre>`, // Wrapping in <pre> to preserve text formatting
// 	};

// 	try {
// 		await sgMail
// 			.send(msg)
// 			.then((response) => {
// 				console.log(response[0].statusCode);
// 				console.log(response[0].headers);
// 			})
// 			.catch((error) => {
// 				console.error(error);
// 			});
// 		console.log("Email sent successfully");
// 	} catch (error) {
// 		console.error("Error sending email:", error);
// 	}
// }
// formatUpdates().then((formattedText) => sendEmail(formattedText));
formatUpdates().then((formattedText) => console.log(formattedText));
