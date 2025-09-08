/* // FOR LATER
const apiUrl = "https://api.rule34.xxx//index.php?" +
	new URLSearchParams({
		"page": "dapi",
		"s": "post",
		"q": "index",
		"id": id,
		"api_key": token.rule34,
		"user_id": "2373207"
	}).toString();
*/
const { token } = require("./config.json");

console.log(token.discord);
console.log(token.rule34);