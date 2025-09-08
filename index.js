/* // FOR LATER
const apiUrl = "https://api.rule34.xxx//index.php?" +
	new URLSearchParams({
		"page": "dapi",
		"s": "post",
		"q": "index",
		"id": id,
		"api_key": "e3541e79620b91846e0054b863b4f03dad3904bdce414cf99d7cd70df57cd48698cc42b5409aee0459685640157c9d4bdfbc32582c292953375b1ccc6ee1e3ef",
		"user_id": "2373207"
	}).toString();
*/
const { token } = require("./config.json");

console.log(token.discord);
console.log(token.rule34);