# Cheatsheet

## Search by tag

### `foo bar`

Returns posts that have the tags `foo` and `bar`.

### `( foo ~ bar )`

Returns posts that have the tags `foo` or `bar`.

This will return posts with at least one tag from each group:
`( foo ~ bar ) ( bax ~ qux )` returns posts that have `foo` and `bax`, `bar`
and `bax`, `foo` and `qux`, and `bar` and `qux`.

More tags can be included in an 'or' group as long as they are separated by
spaces and a tilde; for example, `( foo ~ bar ~ bax )` will return posts that
have the tags `foo`, `bar`, or `bar`.

### `foo~`

Returns posts that have tags similar to `foo`; in other words, fuzzily searches
for `foo`.

This will return posts with tags similar to `foo`, such as `too`, `goo`, and
`woo`.

> [!NOTE]
> The results are supposedly based on the
> [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance).
>
> Whether that means they're sorted by the closest tag's distance or if they're
> sorted normally with an upper bound for the closest tag's distance is beyond
> me. I will update.

### `-foo`

Returns posts that don't have the tag `foo`.

### `foo*`

Returns posts with at least one tag that starts with `foo`.

This will return posts with tags such as `foobar`, `foobaz`, and even `foo`
itself.

### `foo*bar`

Returns posts with tags that start with `foo` and end with `bar`.

This will return posts with tags such as `foobazbar`, `fooquxbar`, and even
`foobar` itself.

> [!NOTE]
> Despite the partial operator working as a search with the start and middle of
> tags, you cannot use this to search for posts that have tags with a specific
> ending; the queried tag has to have content to the left of its asterisk to
> count. For example, `*foo` is ignored, and a post with no `foo`-ending tag
> may appear.

## Search by value

### `md5:foo`

Returns posts whose MD5 hash is `foo`.

This can be combined with the partial operator, such as `md5:foo*`, to return
posts whose hash starts with `foo`.

### `user:foo`

Returns posts whose owner is `foo`; in other words, returns posts that
have been uploaded by user `foo`.

### `rating:foo`

Returns posts whose rating is `foo`.

This can be combined with the negative operator, such as `-rating:foo`, to
return posts whose rating isn't `foo`.

*'foo'* is an invalid example; there are strict values that are accepted:

* `explicit`: Returns posts whose media contains nudity or sex.
* `questionable`: Returns posts whose media contains implications or
suggestions toward sex, revealing clothing, or is generally 'questionable.'
Also returns posts that can be deemed safe.

> [!NOTE]
> The `safe` value is recently obsolete and `rating:safe` no longer returns
> anything useful. Any post that was labeled with such has been re-labeled as
> `questionable`.

> [!CAUTION]
> The rating of posts is user-based; To insert an opinion, users don't usually
> label things properly. For example, a mildly questionable post may be labeled
> `explicit` because of the user's interests, and a post with a visible penis
> may be labeled `questionable` because of the user's lack of sensitivity.
>
> With that being said, as the `safe` rating has been superseded, and as
> `explicit` and `questionable` are *very commonly* confused and used
> interchangably, I would recommend not using this for any regard at all, let
> alone its intended purpose. Only use this for technical reasons.

### `width:123`

Returns posts whose media's width in pixels is `123`.

### `height:123`

Returns posts whose media's height in pixels is `123`.

### `id:123`

Returns posts whose ID is `123`.

### `parent:123`

Returns posts whose ID or parent is `123`; In other words, returns the post
at ID `123` along with its children.

### `score:123`

Returns posts whose score is `123`.

This value is updated once daily at 12:00 AM CST.

## Search by value comparison

### `foo:>123`

Returns posts whose `foo` value is greater than `123`.

*'foo'* is an invalid example; there are strict values that are accepted:

* [`width`](#width123)
* [`height`](#height123)
* [`id`](#id123)
* [`score`](#score123)

*>* (greater than) is only an example; there are more values that are
accepted:

* `=` (equals) or none given: Returns posts whose specified value is equal to
the given number.
* `>` (greater than): Returns posts whose specified value is greater than the
given number.
* `>=` (greater than, equals): Returns posts whose specified value is greater
than or equal to the given number.
* `<` (less than): Returns posts whose specified value is less than the given
number.
* `<=` (less than, equals): Returns posts whose specified value is less than or
equal to the given number.

> [!NOTE]
> The colon (`:`) is mandatory, even if you're searching by value comparison:
> `foo>123` is invalid; the proper format is `foo:>123`.

## Sort results

### `sort:foo:desc`

Returns posts ordered by `foo` descending, from 9-1.

*'foo'* is an invalid example; there are strict values that are accepted:

* [`width`](#width123)
* [`height`](#height123)
* [`id`](#id123)
* [`parent`](#parent123)
* [`score`](#score123)
* `source`: Returns posts ordered by their source value alphabetically,
starting with the Japanese character "～" (nami dasshu).
* `updated`: Returns posts ordered by the date they were last updated.
* `date`: Returns posts ordered by their date of creation.

> [!IMPORTANT]
> [The official Rule34 Cheatsheet](./given/cheatsheet.md) states that you can
> sort by `rating` and `user`, but doing so will not provide you any results.

> [!CAUTION]
> Sorting by `source` isn't reliable ascending; currently, the following
> results for such are ordered:
> 
> * `https://rule34.paheal.net/post/view/513160`
> * `https://rule34.paheal.net/post/view/513159`
> * `http://rule34.paheal.net/post/view/513170`
> * `https://rule34.paheal.net/post/view/513161`

*:sort* is only an example; there are more values that are accepted:

* `:desc` or none given: Returns posts ordered from high to low; 9-1-A-Z and
late-early.
* `:asc`: Returns posts ordered from low to high; Z-A-1-9 and early-late.
