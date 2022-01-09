# Public API

- GET /posts?createdBefore=[timestamp]&createdAfter=[timestamp] for a particular timestamp range (createdAt)
  - of several source addresses: &address=[comma-separated list of addresses]
  - OR with a particular tag: &tag=[tag]
  - OR replies to a specific post hash: &replyTo=[hash]
- GET /sources?address=[comma-separated list of addresses]
- GET /sources - returns default sources

# Inbox API
- addPost(post, source)

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
  * postHash - hash. Retrieve the file from the asset store
* signature - string 
* mentions - [sourceMention]
* hash - string, every post version will be stored as a separate file in the fileStore

## sourceMention
* name
* address

## postStats
* likesCount - int
* repostsCount - int
* commentsCount - int

## source
* address
* name
* updatedAt - epoch time in milliseconds
* avatar - media
* hosts - [host]
* signature - string

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

