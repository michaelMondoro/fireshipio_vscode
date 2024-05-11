const vscode = require('vscode');
const axios = require('axios');
const xmlParser = require('fast-xml-parser');
const opn = require('opn');
var videos;

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	videos = getVideos();
	let disposable = vscode.commands.registerCommand('fireship-io-please.videos', searchVideos);
	context.subscriptions.push(disposable);
}

async function getVideos() {
	// Get video data
	const vid_res = await axios.get("https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA");
	const videos = xmlParser.parse(vid_res.data).feed.entry.map(video => {
		return {label: video.title,
				detail: video.published.split("T")[0],
				desc: video['media:group']['media:description'],
				link: "https://www.youtube.com/watch?v=" + video['yt:videoId'],
				id: video['yt:videoId']
		}
	});
	return videos;
}

async function searchVideos() {
	const vid = await vscode.window.showQuickPick(videos, {
		matchOnDetail: true
	});
	if (vid) {
		console.log(vid);
		vscode.window.showInformationMessage(`I use Arch btw 🔥`);
		opn(vid.link);
	}
}
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
