## INFO30005 Deliverable 2 - Mockup App Server

<br>

## Team: Runtime Terror

### Tutor: Xiao Han

### Tutorial day and time: Wednesday 11 am

### Team number: 13

### Team Members:

| Name     | Student ID | Email                               | Working On |
| -------- | ---------- | ----------------------------------- | ---------- |
| Kaif     | 1068214    | kahsan@student.unimelb.edu.au       | Back-end   |
| Kamyar   | 1068176    | kkarimifakhr@student.unimelb.edu.au | Front-end  |
| Keith    | 1118943    | kleonardo@student.unimelb.edu.au    | Back-end   |
| Hasan    | 1118853    | sohi@student.unimelb.edu.au         | Front-end  |
| Mitchell | 823604     | mneedham@student.unimelb.edu.au     | Back-end   |

## Tech Stack

- Figma
- Node.js
- MongoDB
- Heruko
  <br> <br>

## API Documentation

### Test Credentials

#### Customer

| Email       | Password | Token                                                                                                                                                                                        |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| test@test   | 1234     | 1234567                                                                                                                                                                                      |
| sample@user | 4321     | [Copy token](eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNhbXBsZUB1c2VyIiwicGFzc3dvcmQiOiI0MzIxIiwidGltZXN0YW1wIjoiMjAyMS0wNC0yM1QwNzowNzo1My4yMTVaIn0.AfglmUPAmHwB6lMpFRPWvkrQenCAuM115rbJGwjmaqY) |

#### Vendor

| Name | Password | Token |

### Customer App API

#### View menu of snacks (including pictures and prices)

- _Heroku URL:_ https://info30005-customer-backend.herokuapp.com/api/customer/menu

- _Postman Example:_
  <img src="resources/customer-view-menu.png" alt="View menu of snacks screenshot">

#### View details of a snack

- _Heroku URL:_ https://info30005-customer-backend.herokuapp.com/api/customer/menu/:itemID

- _Postman Example:_
  <img src="resources/customer-view-menu.png" alt="View details of a snack screenshot">

#### Customer starts a new order by requesting a snack

- _Heroku URL:_ https://info30005-customer-backend.herokuapp.com/api/customer/order

- _Postman Example:_
  <img src="resources/customer-order.png" alt="New order request screenshot">

### Vendor App API

#### Setting van status (vendor sends location, marks van as ready-for-orders)

- _Heroku URL:_

  - https://info30005-vendor-backend.herokuapp.com/api/vendor/open
  - https://info30005-vendor-backend.herokuapp.com/api/vendor/close
  - https://info30005-vendor-backend.herokuapp.com/api/vendor/relocate

- _Postman Example:_
  <img src="resources/vendor-open.png" alt="Van status request screenshot">
  <br>
  <br>

  <img src="resources/vendor-close.png" alt="Van status request screenshot">

#### Show list of all outstanding orders

- _Heroku URL:_ https://info30005-vendor-backend.herokuapp.com/api/vendor/orders

- _Postman Example:_

  <img src="resources/vendor-orders.png" alt="Van status request screenshot">

#### Mark an order as "fulfilled" (ready to be picked up by customer)

- _Heroku URL:_ https://info30005-vendor-backend.herokuapp.com/api/vendor/fulfillOrder

- _Postman Example:_
  <img src="resources/vendor-fullfillOrder.png" alt="Order fulfilled request screenshot">
