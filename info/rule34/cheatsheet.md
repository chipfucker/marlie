# Cheatsheet

## Search by tag

Tags can be used with special syntax to achieve more precise results.

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

This can be combined with the partial operator, such as `md5:foo*`, which
returns posts whose hash starts with `foo`.

### `user:foo`

Returns posts whose owner is `foo`; in other words, returns posts that
have been uploaded by user `foo`.

### `rating:foo`

Returns posts whose rating is `foo`.

This can be combined with the negative operator, such as `-rating:foo`, which
returns posts whose rating isn't `foo`.

#### Allowed values

There are only certain values that are accepted in place of `foo`. (Note that
`foo` is an invalid value and is only used as an example.)

| Value          | Description                       |
| -------------- | --------------------------------- |
| `explicit`     | Contains nudity or sex            |
| `questionable` | Doesn't contain explicit material |

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
> interchangably, I would recommend not using this for its intended purpose.
> Only use this for technical reasons.

### `width:123`

Returns posts whose media's width in pixels is `123`.

Any value in place of `123` must be an integer.

### `height:123`

Returns posts whose media's height in pixels is `123`.

Any value in place of `123` must be an integer.

### `id:123`

Returns posts whose ID is `123`.

Any value in place of `123` must be an integer.

### `parent:123`

Returns posts whose ID or parent is `123`; In other words, returns the post
at ID `123` along with its children.

Any value in place of `123` must be an integer.

### `score:123`

Returns posts whose score is `123`; in other words, returns posts whose total
upvotes equals `123`.

This value is updated once daily at 12:00 AM CST.

Any value in place of `123` must be an integer.

## Search by value comparison

### `foo:>123`

Returns posts whose `foo` value is greater than `123`.

#### Allowed values

There are only certain values that are accepted in place of `foo`. (Note that
`foo` is an invalid value and is only used as an example.)

| Value                  | Description              |
| ---------------------- | ------------------------ |
| [`width`](#width123)   | Media's width in pixels  |
| [`height`](#height123) | Media's height in pixels |
| [`id`](#id123)         | ID                       |
| [`score`](#score123)   | Total upvotes            |

There are only certain values that are accepted in place of `>` (greater than).

| Value                       | Description              |
| --------------------------- | ------------------------ |
| `=` (equals) or none        | Equal to                 |
| `>` (greater than)          | Greater than             |
| `>=` (greater than, equals) | Greater than or equal to |
| `<` (less than)             | Less than                |
| `<=` (less than, equals)    | Less than or equal to    |

Any value in place of `123` must be an integer.

> [!NOTE]
> The colon (`:`) is mandatory, even if you're searching by value comparison:
> `foo>123` is invalid; the proper format is `foo:>123`.

## Sort results

### `sort:foo:desc`

Returns posts ordered by `foo` descending.

#### Allowed values

There are only certain values that are accepted in place of `foo`. (Note that
`foo` is an invalid value and is only used as an example.)

| Value                  | Description              | Type    |
| ---------------------- | ------------------------ | ------- |
| [`width`](#width123)   | Media's width in pixels  | Integer |
| [`height`](#height123) | Media's height in pixels | Integer |
| [`id`](#id123)         | ID                       | Integer |
| [`parent`](#parent123) | Parent post ID           | Integer |
| [`score`](#score123)   | Total upvotes            | Integer |
| `source`               | Source text              | String  |
| `updated`              | Date of last update      | Time    |
| `date`                 | Date of creation         | Time    |

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

There are only certain values that are accepted in place of `:desc`.

| Value           | Description                                      |
| --------------- | ------------------------------------------------ |
| `:desc` or none | Ordered from high to low; 9-1-A-Z and late-early |
| `:asc`          | Ordered from low to high; Z-A-1-9 and early-late |
