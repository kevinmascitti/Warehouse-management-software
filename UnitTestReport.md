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
|(0, maxint)| (0, maxint) | (0, maxint) | (0, maxint)  |Valid|T1(5,9.99,"description",1,2) -> Ok|












### **Class *sku* - method *storeSku***

 **Criteria for method *storeSku*:**
	
- Sign of weight
- Sign of volume
- Sign of price
- Sign of availableQuantity

**Predicates for method *storeSku*:**

| Criteria              | Predicate |
| ------------------------ | --------- |
| Sign of weight  | (minint, 0)     |
|                          |(0, maxint)     |
| Sign of volume  | (minint, 0)     |
|                          |(0, maxint)     |
| Sign of price  | (minint, 0)     |
|                          |(0, maxint)     |
| Sign of availableQuantity  | (minint, 0)     |
|                          |(0, maxint)     |


**Boundaries**:

| Criteria | Boundary values |
| --------- | --------------- |
|   Sign of availableQuantity        |  1               |
|   Sign of availableQuantity        |  -1               |
|   Sign of weight        |  0.001               |
|   Sign of weight        |  -0.001             |
|   Sign of volume        |  0.001               |
|   Sign of volume        |  -0.001               |
|   Sign of price        |  0.001               |
|   Sign of price        |  -0.001               |



**Combination of predicates**:


| Sign of weight | Sign of volume | Sign of price | Sign of availableQuantity | Valid / Invalid | Description of the test case |
|-------|-------|-------|--------|-----|------|
|(minint, 0)| * | * | *  |Invalid|T1("a new sku",-50,90,9.99,20) -> Error|
|*| (minint, 0) | * | *  |Invalid|T2("a new sku",50,-90,9.99,20) -> Error|
|*| * | (minint, 0) | *  |Invalid|T3("a new sku",50,90,-9.99,20) -> Error|
|*| * | * | (minint, 0)  |Invalid|T4("a new sku",50,90,9.99,-20) -> Error|
|(0, maxint)| (0, maxint) | (0, maxint) | (0, maxint)  |Valid|T5("a new sku",50,90,9.99,20) -> Ok|
















### **Class *skuitem* - method *getStoredSkuitem***



**Criteria for method *getStoredSkuitem*:**
	
- Length of RFID

**Predicates for method *getStoredSkuitem*:**

| Criteria              | Predicate |
| ------------------------ | --------- |
| Length of RFID  | 32     |
|                          | !=32     |


**Boundaries**:

| Criteria | Boundary values |
| --------- | --------------- |
|   Lenght of RFID        |  12345678123456781234567812345678 (32 digits) |
|   Length of RFID        |  123456781234567812345678123456781  (33 digits)|
|   Length of RFID        |  1234567812345678123456781234567  (31 digits)|



**Combination of predicates**:


| Length of RFID | Valid / Invalid | Description of the test case |
|-------|-------|-------|
|32 digits|Valid|T1(12345678123456781234567812345678) -> Ok|
|31 digits|Invalid|T1(1234567812345678123456781234567) -> Error|
|33 digits|Invalid|T1(123456781234567812345678123456781) -> Error|


 ### **Class *skuitem* - method *storeSkuitem***

 **Criteria for method *storeSkuitem*:**
	
- Length of RFID
- Value of Available
- Sign of skuId
- Format of DateOfStock

**Predicates for method *storeSkuitem*:**

| Criteria              | Predicate |
| ------------------------ | --------- |
| Length of RFID  | 32     |
|                          | !=32     |
| Value of Available  | == 0 OR == 1     |
|                          | !=0 AND !=1     |
| Sign of skuId  | (minint, 0)     |
|                          |(0, maxint)     |
| Format of DateOfStock  | valid date     |
|                          |invalid date     |


**Boundaries**:

| Criteria | Boundary values |
| --------- | --------------- |
|   Lenght of RFID        |  12345678123456781234567812345678 (32 digits) |
|   Length of RFID        |  123456781234567812345678123456781  (33 digits)|
|   Length of RFID        |  1234567812345678123456781234567  (31 digits)|
|   Sign of skuId        |  1               |
|   Sign of skuId        |  -1               |


**Combination of predicates**:


| Length of RFID | Value of Available | Sign of skuid | Format of DateOfStock | Valid / Invalid | Description of the test case |
|-------|-------|-------|--------|-----|------|
|!=32 | * | * | *  |Invalid|T1(46473847434,1,1,19/05/2022) -> Error|
|*| !=0 AND !=1 | * | *  |Invalid|T2(12345678123456781234567812345678,5,1,19/05/2022) -> Error|
|*| * | (minint, 0) | *  |Invalid|T3(12345678123456781234567812345678,1,-1,19/05/2022) -> Error|
|*| * | * | invalid DateOfStock  |Invalid|T4(12345678123456781234567812345678,1,1,1932/2205/2022) -> Error|
|==32| ==0 OR ==1 | (0, maxint) | valid DateOfStock  |Valid|T5(12345678123456781234567812345678,0,1,19/05/2022) -> Ok|



# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|item (DAO)|get item|
|item (DAO)|get items|
|item (DAO)|get not inserted item|
|item (DAO)|duplicated item|
|item (DAO)|item present|
|item (DAO)|item not present|
|item (DAO)|delete item|
|item (DAO)|edit item|
|item (DAO)|supplier already sells this item|
|skuitem (DAO)|get skuitem|
|skuitem (DAO)|get available skuitem by skuid|
|skuitem (DAO)|get skuitems|
|skuitem (DAO)|get not inserted skuitem|
|skuitem (DAO)|duplicated skuitem|
|skuitem (DAO)|skuitem present|
|skuitem (DAO)|skuitem not present|
|skuitem (DAO)|delete skuitem|
|skuitem (DAO)| editSkutem|
|sku (DAO)|sku position already assigned to another sku|
|sku (DAO)|modify position of an sku|
|sku (DAO)|editSku without test descriptors|
|sku (DAO)|editSku with test descriptors|
|sku (DAO)|get sku|
|sku (DAO)|get skus|
|sku (DAO)|get not inserted sku|
|sku (DAO)|sku present|
|sku (DAO)|sku not present|
|sku (DAO)|delete sku|


### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >

