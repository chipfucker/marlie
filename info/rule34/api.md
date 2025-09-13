# Rule34 API Info

## Parameters

HREF before search query: `https://api.rule34.xxx/index.php`

* `page`: Will usually be 'dapi' for api access.
* `q`: Is usually 'index.'
* `s`: Describes the type of info that will be returned.

### s=post

HREF before paramaters:
`https://api.rule34.xxx/index.php?page=dapi&q=index&s=post`

* `limit`: Describes the maximum amount of posts to return.
	* Defaults to 50.
	* Max is 1000.
* `pid` (page ID): Defines the page of results to fetch from based on the
	`limit`.
	* Defaults to 0.
* `tags`: Defines the search query to use when fetching posts.
	* Queries work the same here as they do on the website, as long as they are
	properly encoded as a URI.
	[See the cheatsheet for more info.](./cheatsheet.md)
* `cid` (change ID): Defines the change ID of posts to be provided.
	* This will usually return a minimal amount; It's supposed to work similarly to searching for a post by its ID.