# FIRESTORE SCHEMA
- COLLECTIONS:
    
    - USERS: // KEY -> user's id
        - id // user's id
        - name
        - avatar
        - lastOnline // UTC timestamp
        - conversations // [] array of CONVERSATIONS's ID which is formated by userId-sellerId-productId
        - createdAt
        - blacklist: {
            - [userId]: timestamp
        }
    
    - CONVERSATIONS // KEY -> userId-sellerId-productId
        - userId
        - sellerId
        - productId
        - createdAt
        - lastMessageId // Message's id
        - typing: {
            - [userId]: timestamp
        }

        Sub-collection: 
        - MESSAGES // KEY -> default
            - type // text | photo | attachment | location
            - content
            - meta
            - createdAt
            - updatedAt
            - userId // user's id
            - sent
            - received

