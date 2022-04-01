
 #Requirements Document 

Date: 22 march 2022

Version: 0.0

 
| Version number | Change |
| ----------------- |:-----------|
| | | 


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	+ [Functional Requirements](#functional-requirements)
	+ [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	+ [Use case diagram](#use-case-diagram)
	+ [Use cases](#use-cases)
    	+ [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|	Company	| Buys from suppliers and manages warehouses |
|	Retailer	| Same as company but sells to the customers |
|	Supplier	| Provides the goods |
|	Warehouse Manager		| Supervises the warehouse |
|	Warehouse Employee	| Works in the warehouse |
|	Quality Office	| Performs quality checks |
|	Software Office	| Installs, maintains, provides security controls and manages the network of the software |
|	Organizational Unit	| Manages different aspects of the company |	
|	System Administrator	| Manages system privileges |
|	Transport Companies	| Ships the goods from and to the warehouse |
|	Cloud Service	| Provides centralized database |


# Context Diagram and interfaces

## Context Diagram
\<Define here Context diagram using UML use case diagram>

\<actors are a subset of stakeholders>

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|   Software Office    | GUI | Keyboard, mouse and screen on PC |
|   Quality Office    | GUI | Keyboard, mouse and screen on PC |
|   Organizational Units    | GUI | Keyboard, mouse and screen on PC |
|   System Administrator    | GUI | Keyboard, mouse and screen on PC |
|   Warehouse Manager    | GUI | Keyboard, mouse and screen on PC |
|   Warehouse Employee    | GUI | Keyboard, mouse and screen on PC |
|   Cloud Service  | API | Internet |
|   Supplier    | Email | Internet |

# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>


# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

| ID        | Description  |
| ------------- |:-------------:| 
|  FR1     | Manage warehouse items |
|  FR1.1     | Add item |
|       | Delete item |
|       | Locate item |
|       | Modify item information |
|       | Supplier list |
|       |  |
|       |  |
|  FR2     | Manage quality check |
|       | Define test list for each item |
|       | Pick random item for test |
|       | Quality check pass |
|       | Send back faulty items |
|       |  |
|  FR3     | Manage external orders |
|       | Add order and send email to supplier |
|       | Check quantity |
|       | Refill item stock and email supplier |
|       |  |
|  FR4     | Manage internal order |
|       | Add order |
|       | Specify pickup area |
|       | Acknowledge fulfilled order |
|       |  |
|  FR5     | Manage physical space |
|       | Check available space |
|       | Organize inventory |
|       |  |
|  FR6     | Manage cloud |
|       | Sync warehouse items |
|       | Provide backup |
|       |  |
|   FR7    | Manage privileges |
|       | Add role |
|       | Modify role |
|       | Remove role |
|       |  |

## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Usability | 20 hours needed to learn using the program |  |
|  NFR2     | Efficiency | All functions should be executed in less than 0.1 seconds |  |
|  NFR3     | Correctness | Capability to provide correct functionality in ALL cases | |
| NFR4 | Reliability | Mean time between failures ~ 250 hours | | 
| NFR5 | Security | Protection from malicious users. Access only for authorized users | | 
| NFR6 | Portability | Cross-platform interoperability | | 
| NFR7 | Robustness | Time to restart after failure ~ 5 minutes | |  

# Use case diagram and use cases


## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>


\<next describe here each use case in the UCD>
### Use case 1, UC1 - Authentication
| Actors Involved        | Employee |
| ------------- |:-------------:| 
|  Precondition     | User is not authenticated |
|  Post condition     | User is authenticated |
|  Nominal Scenario     | User inputs username and password in GUI page |
|  Variants     | User inputs wrong credentials |

##### Scenario 1.1 

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the scenario can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after scenario is finished> |
| Step#        | Description  |
|  1     |  |  
|  2     |  |
|  ...     |  |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2 - Manage Items
| Actors Involved        | Employee |
| ------------- |:-------------:| 
|  Precondition     | Item exists |
|  Post condition     |  |
|  Nominal Scenario     | Item is added to the warehouse |
|  Variants     | Item already exists and it is modified |
|	| Item already exists and it is deleted |
|	| Item already exists and it is located |
|	| Item already exists. Show supplier list |
|	| Check item quantity |
|	Exception	|	Not enough space in warehouse to add item	|
|	|	Cannot add already existing item	|

### Use case 3, UC3 - Manage External Orders
| Actors Involved        | Warehouse Manager |
| ------------- |:-------------:| 
|  Precondition     |  |
|  Post condition     |  |
|  Nominal Scenario     | Manager creates order |
|  Variants     | Existing order is modified |
|	| Existing order is deleted |

### Use case 4, UC4 - Quality Check
| Actors Involved        | Quality Office |
| ------------- |:-------------:| 
|  Precondition     | Item exists |
|  Post condition     | Item is evaluated |
|  Nominal Scenario     | Item passes quality check |
|  Variants     | Item does not pass quality check |

### Use case 5, UC5 - Manage privileges
| Actors Involved        | System Administrator |
| ------------- |:-------------:| 
|  Precondition     | User exists |
|  Post condition     | User has changed privileges |
|  Nominal Scenario     | System Administrator changes user privileges |

### Use case 6, UC6 - Manage Internal Orders
| Actors Involved        | Organizational Units |
| ------------- |:-------------:| 
|  Precondition     | Items in order exist |
|  Post condition     | Order has been created |
|  Nominal Scenario     | OU creates internal order |
|	Exception	|	Not enough items to complete order 	|

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >




