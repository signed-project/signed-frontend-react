# Public API

- getPosts for a particular timestamp range (createdAt)
  - of several source addresses 
  - OR with a particular tag
  - OR replies to a specific post hash
- getSources by a list of addresses
- getDefaultSources

# Inbox API

The Inbox API is protected by rate limiting

# Private API
- addPost
- addSource
- deletePost - need to specify the createdAt timestamp
- uploadAsset
- registerUser
- login

The APIs may be protected by AWS WAF

# Data Dictionary

## post
* address - source address
* createdAt - epoch time in milliseconds, serves as the id of the post (!)
* type - 'post' | 'like' | 'repost' | 'reply'
* updatedAt - epoch time in milliseconds, the client may reject anything updated in the future
* text
* attachments - [media]
* target
  * address - source address of the target
  * postHash - hash. Retrieve the file from the replyToSource.fileStores
* signature - string, optional 
* likesCount - int
* repostsCount - int
* commentsCount - int
* mentions - [source]
* hash - string, every post version will be stored as a separate file in the fileStore

## source
* address
* name
* updatedAt - epoch time in milliseconds
* avatar - media
* hosts - [host]
* signature - signature, optional

## host
* assets - url
* api - url
* index - url, optional, contains an archive of all posts 
* inbox - url

## signature
* address - string
* signature - string
* type - ECDSA by default

## media
* contentType - mime
* hash - optional, either hash or url
* url - optional, either hash or url
* width - optional
* height - optional
* thumbnail - media, optional

## index
* mainSource - source
* recentPosts - [post]
* pinnedPosts - [post]
* sources - [source]
* archives - [archive]
* tags - [tag]

## archive
* dateStart - unixtime
* dateEnd - unixtime
* posts - [post]
* sources - [source]
* hash - optional

## tag
* name
* posts - [post]
* sources - [source]
* hash - optional

## inbox_request
* post_url
* signature
