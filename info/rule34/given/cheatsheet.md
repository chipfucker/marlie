# Help: Cheat Sheet

## Searching

**tag1 tag2**   
Search for posts that have tag1 tag2.

**( tag1 ~ tag2 )**   
Search for posts that have tag1 or tag2. The braces are **important** to group
the tags between which the "or" counts. The spaces between the braces and tags
are also **important** because some tags end in braces!

**night~**   
Fuzzy search for the tag night. This will return results such as night fight
bright and so on according to the
[Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance).

**-tag1**   
Search for posts that don't have tag1.

**ta*1**   
Search for posts with tags that starts with ta and ends with 1.

**user:bob**   
Search for posts uploaded by the user Bob.

**md5:foo**   
Search for posts with the MD5 hash foo.

**md5:foo***   
Search for posts whose MD5 starts with the MD5 hash foo. 

**rating:questionable**   
Search for posts that are rated questionable.

**-rating:questionable**   
Search for posts that are not rated questionable.

**parent:1234**   
Search for posts that have 1234 as a parent (and include post 1234).

**rating:questionable rating:safe**   
In general, combining the same metatags (the ones that have colons in them)
will not work.

**rating:questionable parent:100**   
You can combine different metatags, however.

**width:>=1000 height:>1000**   
Find images with a width greater than or equal to 1000 and a height greater
than 1000.

**score:>=10**   
Find images with a score greater than or equal to 10. This value is updated
once daily at 12AM CST.

**sort:updated:desc**   
Sort posts by their most recently updated order.

***Other sortable types:***

* id
* score
* rating
* user
* height
* width
* parent
* source
* updated 

Can be sorted by both asc or desc. 