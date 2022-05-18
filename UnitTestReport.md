# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

 ### **Class *item* - method *getStoredItem***



**Criteria for method *getStoredItem*:**
	
- Sign of id

**Predicates for method *getStoredItem*:**

| Criteria              | Predicate |
| ------------------------ | --------- |
| Sign of id  | (minint, 0)     |
|                          |(0, maxint)     |


**Boundaries**:

| Criteria | Boundary values |
| --------- | --------------- |
|   Sign of id        |  1               |
|   Sign of id        |  -1               |



**Combination of predicates**:


| Sign of id | Valid / Invalid | Description of the test case |
|-------|-------|-------|
|(minint, 0)|Invalid|T1(-5) -> Error|
| (0, maxint) |Valid|T2(3) -> Ok|


 ### **Class *item* - method *modifyStoredItem***

**Criteria for method *modifyStoredItem*:**
	
- Sign of id
- Sign of newPrice

**Predicates for method *modifyStoredItem*:**

| Criteria              | Predicate |
| ------------------------ | --------- |
| Sign of id  | (minint, 0)     |
|                          |(0, maxint)     |
| Sign of newPrice  | (minint, 0)     |
|                          |(0, maxint)     |


**Boundaries**:

| Criteria | Boundary values |
| --------- | --------------- |
|   Sign of id        |  1               |
|   Sign of id        |  -1               |
|   Sign of newPrice        |  0.001               |
|   Sign of newPrice        |  -0.001             |



**Combination of predicates**:


| Sign of id | Sign of newPrice | Valid / Invalid | Description of the test case |
|-------|-------|-------|--------|
|(minint, 0)|(minint, 0) |Invalid|T1(-5,-9.99,"new description") -> Error|
|(minint, 0)|(0, maxint) |Invalid|T2(-5,9.99,"new description") -> Error|
|(0, maxint)|(minint, 0) |Invalid|T3(2,-9.99,"new description") -> Error|
|(0, maxint)|(0, maxint) |Valid|T4(2,-9.99,"new description") -> Ok|


 ### **Class *item* - method *storeItem***

 **Criteria for method *storeItem*:**
	
- Sign of id
- Sign of price
- Sign of skuId
- Sign of supplierId

**Predicates for method *storeItem*:**

| Criteria              | Predicate |
| ------------------------ | --------- |
| Sign of id  | (minint, 0)     |
|                          |(0, maxint)     |
| Sign of newPrice  | (minint, 0)     |
|                          |(0, maxint)     |
| Sign of skuId  | (minint, 0)     |
|                          |(0, maxint)     |
| Sign of supplierId  | (minint, 0)     |
|                          |(0, maxint)     |


**Boundaries**:

| Criteria | Boundary values |
| --------- | --------------- |
|   Sign of id        |  1               |
|   Sign of id        |  -1               |
|   Sign of newPrice        |  0.001               |
|   Sign of newPrice        |  -0.001             |
|   Sign of skuId        |  1               |
|   Sign of skuId        |  -1               |
|   Sign of supplierId        |  1               |
|   Sign of supplierId        |  -1               |



**Combination of predicates**:


| Sign of id | Sign of newPrice | Sign of skuid | Sign of supplierId | Valid / Invalid | Description of the test case |
|-------|-------|-------|--------|-----|------|
|(minint, 0)| * | * | *  |Invalid|T1(-5,9.99,"description",1,2) -> Error|
|*| (minint, 0) | * | *  |Invalid|T1(5,-9.99,"description",1,2) -> Error|
|*| * | (minint, 0) | *  |Invalid|T1(5,9.99,"description",-1,2) -> Error|
|*| * | * | (minint, 0)  |Invalid|T1(5,9.99,"description",1,-2) -> Error|
|(0, maxint)| (0, maxint) | (0, maxint) | (0, maxint)  |Invalid|T1(5,9.99,"description",1,2) -> Ok|






# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|Item|get item|
|Item|get items|
|Item|get not inserted item|
|Item|duplicated item|
|Item|item present|
|Item|item not present|
|Item|delete item|
|Item|edit item|

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >

