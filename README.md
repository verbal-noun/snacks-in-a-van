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

### Customer App API

#### View menu of snacks (including pictures and prices)

- _Heroku URL:_ https://info30005-backend.herokuapp.com/api/customer/menu

- _Postman Example:_
  <img src="resources/dummypostman.png" alt="View menu of snacks screenshot">

#### View details of a snack

- _Heroku URL:_ https://info30005-backend.herokuapp.com/api/customer/menu/:itemID

- _Postman Example:_
  <img src="resources/dummypostman.png" alt="View details of a snack screenshot">

#### Customer starts a new order by requesting a snack

- _Heroku URL:_ https://info30005-backend.herokuapp.com/api/customer/order

- _Postman Example:_
  <img src="resources/dummypostman.png" alt="New order request screenshot">

### Vendor App API

#### Setting van status (vendor sends location, marks van as ready-for-orders)

- _Heroku URL:_

  - https://info30005-backend.herokuapp.com/api/vendor/open
  - https://info30005-backend.herokuapp.com/api/vendor/close
  - https://info30005-backend.herokuapp.com/api/vendor/relocate

- _Postman Example:_
  <img src="resources/dummypostman.png" alt="Van status request screenshot">
#### Show list of all outstanding orders

- _Heroku URL:_ https://info30005-backend.herokuapp.com/api/vendor/orders

- _Postman Example:_

#### Mark an order as "fulfilled" (ready to be picked up by customer)

- _Heroku URL:_ https://info30005-backend.herokuapp.com/api/vendor/fulfillOrder

- _Postman Example:_
  <img src="resources/dummypostman.png" alt="Order fulfilled request screenshot">
