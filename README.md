## Database model

```
roles (collection): [
  [roleName (e.g. admin)]: {
    [userId]: true
  }
]
```

```
categories (collection): [
  [categoryName (e.g. Art)]: {
    name: [categoryName],
    itemCount: [number]
  }
]
```

```
items (collection): [
  [lotNumber]: {
    lot: [number]
    category: [id in categories collection]
  }
]
```

```
users (collection): [
  [authId (from auth service)]: {
    phone: string
    email: string
    child/class: string
    notify: boolean
  }
]
```

```
bids (collection): [
  [id]: {
    item: [itemId]
    user: [userId]
    amount: [number]
    timestamp: [DateTime]
  }
]
```

```
bidInfo (collection) [
  itemId: {
    winningBids: [ number ]
    winningAmount: [ number ]
  }
]
```