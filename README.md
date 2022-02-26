# nCompass

## Yolil Order-movement Dashboard

## Authors

Chad Larson
Nathan Cox

## To Run the Dashboard Locally

1. Start the VPN, GlobalProtect.
2. Run the nodemon command from the app's root directory on the command line.

## User Stories

- Map/Param pages

  [x] As an administrator, I would like to review the mappings/parameters so I can spot discrepancies in the way our business is importing orders.  
  [x] As an administrator, I want to be able to sort the rows by any column to make reviewing easier.  
  [x] As an administrator, I want this page to be aesthetically pleasing as well as user friendly.  
  [x] Remove the timer from the local storage, once you've integrated it elsewhere, since this data is rarely updated.
  [ ] As a user, I want all data relevant to settings available, but only a summary shown by default, requiring a click to expand for a full view.

- Purge page

  [ ] As an administrator, I want to purge old orders from the staging system and see the number of orders purged.

- Home Page

  - Pushed Orders

    [ ] As a user, I want to see a graph of orders pushed into GP today.  
    [ ] As a user, I want to see a graph of orders pushed into GP since yesterday.  
    [ ] As a user, I want to see a graph of orders pushed into GP in the last seven days.  
    [ ] As a user, I want to see a graph of orders pushed in the last thirty days.  
    [ ] As a user, I want to be able to choose the number of days shown in the graph and have my choice persist across sessions.

  - Staged Orders

    [x] As a user, I want to see a chart of pending orders by market (pulled but not pushed).  
    [x] As a user, I want to see a chart of all orders ignored.  
    [x] As a user, I want to see a chart of orders that have failed to push.

  - Actions

    [x] As an administrator, I want to initiate a pull operation manually.  
    [x] As an administrator, I want to initiate a push operation manually.

- Failed-orders Page

  - Pull-orders-failed page

    [x] As a user, I want to to see a list of orders (with a count total) that have failed to pull, with some detail, such as Market, Warehouse, Total and the error message, without having to click on an additional button.  
    [x] As an administrator, I want to select one, some, or all failed orders and perform any of the following actions on them:  
     [x] ignore;  
     [x] repull (which deletes from Staging and pulls a fresh version of the order from the CRM);  
     [x] repull while allowing order-amount mismatches.

  - Push-orders-failed page

    [x] As a user, I want to see a list of orders (with a count total) that have failed to push into GP, with details of Order #, Market, Warehouse, and Error message.  
    [x] As an administrator, I want to select one, some, or all failed orders and perform any of the following actions on them:  
     [x] repull (which deletes from Staging and pulls a fresh version of the order from the CRM);  
     [x] delete (from Staging for a later scheduled pull);  
     [x] ignore.

- Order-view page

  [x] As a user, I want to see the order detail from various places (CRM, Staging, GP) to determine how far the order went through the CRM2GP workflow and compare order values among these various stages.  
  [ ] As an administrator, I want to be able to do the following:  
   [x] pull an order manually if it only exists in the CRM;  
   [x] repull or repull with mismatch if an order returns an error, showing these action buttons conditionally;
   [x] repush and order manually if it returns an error, showing this button conditionally;
   [x] push an order manually if it is in Staging and not yet in GP;
   [ ] hide the pull option for the CRM if the order is in staging.

- Logging Page

- [ ] User Authorization (wherever there is an administrator story above)

- Misc

  [ ] Hover hints for buttons.  
  [x] Dark theme.

## Routes

- Config-controller paths

  [x] GET: /api/Config/params  
  [x] GET: /api/Config/maps

- CRM Orders paths:

  [x] GET one: /api/CrmOrders/{orderNumber}  
  [x] GET: /api/CrmOrders/Failed  
  [x] POST: /api/CrmOrders/Ignore  
  [ ] POST: /api/CrmOrders/Pull (pull all?)
  [x] POST: /api/CrmOrders/Repull  
  [x] POST: /api/CrmOrders/RepullAllowMismatch

- Staging-orders paths:

  [x] GET: /api/StagingOrders/summary/{gpPushStatusType}/{daysBack}  
  [x] GET one: /api/StagingOrders/{orderNumber}  
  [x] Get all failed: /api/StagingOrders/Failed  
  [x] POST: /api/StagingOrders/Ignore  
  [x] POST: /api/StagingOrders/Retry (Repush)  
  [x] POST: /api/StagingOrders/Delete
  [ ] POST: /api/StagingOrders/Push (push all?)

- GP Orders paths:

  [x] GET one: /api/GpOrders/{orderNumber}  
  [ ] GET: /api/GpOrders/pushorder/{orderNumber}  
  [ ] GET: /api/GpOrders/push

- Purge-data path (we did not discuss this; it should be another page and secured by the role auth so only admins can run this):

  [ ] GET: /api/Purge/DataLevels  
  [ ] POST: /api/Purge/{monthsToKeep}

## Sources

- The sorting algorithm used in the useSort hook came from [here](https://www.smashingmagazine.com/2020/03/sortable-tables-react/).
