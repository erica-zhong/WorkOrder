# WorkOrder
Chevron's real-time work order scheduling optimization website.

# Background
Chevron has large scale operations and complex process facilities (refineries and liquified natural gas production facilities). Scheduling work orders on these facilities with differing repair requirements, specialized technicians, and potentially hours of drive time between locations can be difficult.

# Challenge
Build a work order tracking system that tracks:

(1) the work orders that are submitted

(2) the technicians that are completing them to optimize how technicians are assigned and work orders are completed. 

Knowing where technicians are, what they are certified/qualified to repair, how long they are planning to being there, other work orders in the same or nearby location, etc will be *invaluable* in being able to dynamically schedule and dispatch existing and new work orders to technicians at the beginning of the day and while onsite. Updating each technician with their schedule of work orders can be done through any means of mobile technology, SMS, call, mobile app, etc.

# Testing Server Code
## Technicians
Submit a new technician
```
curl -d '{"name":"Anthony", "phone_number":17138288185, "certifications":["home building"], "shift":true}' -H "Content-Type: application/json" -X POST http://localhost:8000/worker_submission
```
Get technnicians
```
curl -i "http://localhost:8000/workers"
```


## Workers
Submit a new work order
```
curl -d '{"name":"Erica", "email":"ericaemail.rice.edu", "equipment_id":"SJG23", "equipment_type":"some_equipment", "priority":3, "facility":"great_facility"}' -H "Content-Type: application/json" -X POST http://localhost:8000/workorder_submission
```

Get work orders
```
curl -i "http://localhost:8000/workers"
```
