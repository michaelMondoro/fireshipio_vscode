const vscode = require('vscode');
const axios = require('axios');
const xmlParser = require('fast-xml-parser');
var videos;

async function activate(context) {
	videos = getVideos();
	let disposable = vscode.commands.registerCommand('fireship_videos.videos', searchVideos);
	context.subscriptions.push(disposable);

	vscode.window.showInformationMessage(`I use Arch btw 🔥`);
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
		vscode.env.openExternal(vscode.Uri.parse(vid.link));
	}
}
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
