# Runtime Terror Back-end Repository

## INFO30005 Deliverable 3 - Frontend + Backend (Customer App)

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

| Front-end | Back-end        |
| --------- | --------------- |
| Figma     | Node.js         |
| Canva     | MongoDB         |
| React.js  | MongoDB Atlas   |
| CSS       | MongoDB Compass |
| Bootstrap | Postman         |

## Credentials

#### Customer

| Email           | Password |
| --------------- | -------- |
| random@test.com | 1234567e |
| dymmy           | dummy    |

#### Vendor

| Name        | Password |
| ----------- | -------- |
| Test Vendor | 1234567E |
| d           | d        |

In case, you have lost access / deleted all vendors from the database, a vendor can be created:

    https://info30005-vendor-backend.herokuapp.com/register

Please note that we added this route for emergency purposes as the project requirement does not require us to implement a register page for vendors.

### Database

MongoDB connection string:

    mongodb+srv://root:testtest@cluster0.iyw6v.mongodb.net/snacksInAVan?retryWrites=true&w=majority

## Heruko URL

| App      | Front-end                                         | Back-end                                          |
| -------- | ------------------------------------------------- | ------------------------------------------------- |
| Customer | https://info30005-customer-frontend.herokuapp.com | https://info30005-customer-backend.herokuapp.com/ |
| Vendor   | https://info30005-vendor-frontend.herokuapp.com/  | https://info30005-vendor-backend.herokuapp.com/   |

## Testing

Run the following command to install the required files for integretion testing

    npm install

### Integration testing

The following command will run the tests

    npm run int-test

**Note:** Please do not delete test-vendor from the database as we're using it to perform our integration test.

### Unit Testing

## API Documentation

We used JWT tokens based on the customer/vendor email to authenticate and access restricted resources.

Here we have are including a _test user_ with a fake token created manually by the admins and an
actual user with _sample user_ with an actual JWT token created by the routes to test our routes.

To simulate logging in as a particular user (either Vendor or Customer) on Postman, we must manualy set the
authorization bearer. We simply copy and paste the JWT string of the user we want to log in as for the API route into the token field.

- _Postman Authentication:_
  <img src="resources/postman-auth.png" alt="Set the JWT token for routes that require authentication">

### Customer App API

#### View menu of snacks (including pictures and prices)

- _Heroku URL:_ https://info30005-customer-backend.herokuapp.com/api/customer/menu

- _Postman Example:_
  <img src="resources/customer-view-menu.png" alt="View menu of snacks screenshot">

#### View details of a snack

- _Heroku URL:_ https://info30005-customer-backend.herokuapp.com/api/customer/menu/:itemID

- _Postman Example:_
  <img src="resources/customer-view-menu.png" alt="View details of a snack screenshot">

- _Usage:_
  1. We need to make a GET request to the URL above with the id of a chosen snack.
  2. For example, if we want to view information about 'Cappucino' snack, we would make a GET reqeust to: https://info30005-customer-backend.herokuapp.com/api/customer/menu/60802183979a5a92d4521bff

#### Customer starts a new order by requesting a snack

- _Heroku URL:_ https://info30005-customer-backend.herokuapp.com/api/customer/order

- _Postman Example:_
  <img src="resources/customer-order.png" alt="New order request screenshot">

- _Usage:_

  1. The customer needs to be authenticated to make this type of request. Here we make the POST request with a Bearer token in the HTTP Header to indicate that this is a valid customer.
  2. In the HTTP header of the request we need to add the following header info:
     | Key | Value |
     |----|---|
     |Authorization| Bearer 1234567|
  3. Then we need to define the body of the request with the vendor and orderItems. Vendor is the vendorID and and orderItems is a list of item object. Sample body:<br>
     <img src="resources/customer-order-body.png" alt="Van status request screenshot" width=350>

<br>

### Vendor App API

All the vendor requests need to be authenticated. Hence all of the following API calls should have the following HTTP headers in the POST and GET requests:

| Key           | Value            |
| ------------- | ---------------- |
| Authorization | Bearer 987654321 |

#### Setting van status (vendor sends location, marks van as ready-for-orders)

- _Heroku URL:_

  - https://info30005-vendor-backend.herokuapp.com/api/vendor/open
  - https://info30005-vendor-backend.herokuapp.com/api/vendor/close
  - https://info30005-vendor-backend.herokuapp.com/api/vendor/relocate

- _Postman Example:_

  - _Usage:_

    1. We need to make a POST request to signal open, close or relocate to update the status of the van.
    2. To open or relocate the business, we need to make an POST request to https://info30005-vendor-backend.herokuapp.com/api/vendor/open with address and location. We need to make sure we include the Authorization tokens as mentioned above in the headers. Sample of the body and request:
       <img src="resources/vendor-open.png" alt="Van status request screenshot">
       <br>
       <br>

    3. To close the business, we need to make an POST request to https://info30005-vendor-backend.herokuapp.com/api/vendor/close with address and location. We need to make sure we include the Authorization tokens as mentioned above in the headers. Sample of the body and request:
       <img src="resources/vendor-close.png" alt="Van status request screenshot">

#### Show list of all outstanding orders

- _Heroku URL:_ https://info30005-vendor-backend.herokuapp.com/api/vendor/orders

- _Postman Example:_

  - _Usage:_
    1. We need to make a POST request accordingly with the proper authorization tokens. Sample:
       <img src="resources/vendor-orders.png" alt="Van status request screenshot">

#### Mark an order as "fulfilled" (ready to be picked up by customer)

- _Heroku URL:_ https://info30005-vendor-backend.herokuapp.com/api/vendor/fulfillOrder

- _Postman Example:_
  - _Usage:_
    1. We need to make a POST request with the order we want to the transition the status of. A sample of the body and request as follows:
       <img src="resources/vendor-fullfillOrder.png" alt="Order fulfilled request screenshot">


### Front-end Repository link
https://github.com/INFO30005-2021-SM1/project-frontend-t13-runtime-terror
