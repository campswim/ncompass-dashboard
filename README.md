# nCompass | Order-movement Dashboard Demo

## Authors

Nathan Cox (nate@campswim.co)
Chad Larson (chad@ncompass.org)

## Locations

1. Front-end url: <https://ncompass-dashboard.netlify.app/failed-orders>.
2. Back-end url: <https://dashboard.heroku.com/apps/ncompass-dashboard-api>.

## To Run the App Locally

- run `npm i` from the CLI to install all necessary dependencies.
- run `npm start` from the CLI, ensuring that the API is also running.

## Description

This mockup of the nCompass order-movement dashboard demonstrates the utility of this internal application for accounting departments keen on tracking an order through its full lifecycle, from origination to database storage, with error tracking and resolution built in.

## User Stories

- Home Page

  - Pushed Orders

    [x] As a user, I want to see a list of orders pushed into the storage database.  
    [x] As a user, I want to be able to choose the number of days back the list(s) will display.
    [ ] As a user, I want my my above choice(s) to persist across sessions.

  - Staged Orders

    [x] As a user, I want to see a list of all pending orders by market (pulled but not pushed).  
    [x] As a user, I want to see a list of all orders ignored, by market.  
    [x] As a user, I want to see a list of all orders that have failed to push.

  - Actions

    [ ] As an administrator, I want to initiate a pull operation manually.  
    [ ] As an administrator, I want to initiate a push operation manually.

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

- Map/Param pages

  [x] As an administrator, I would like to review the mappings/parameters so I can spot discrepancies in the way our business is importing orders.  
  [x] As an administrator, I want to be able to sort the rows by any column to make reviewing easier.  
  [x] As an administrator, I want this page to be aesthetically pleasing as well as user friendly.  
  [x] Remove the timer from the local storage, once you've integrated it elsewhere, since this data is rarely updated.
  [ ] As a user, I want all data relevant to settings available, but only a summary shown by default, requiring a click to expand for a full view.

- Planned future functionality

  - User Authentication and Authorization

    [ ] User login and logout.
    [ ] User Authorization (wherever there is an administrator story).
  
  - Purge page

    [ ] As an administrator, I want to purge old orders from the staging system and see the number of orders purged.

  - Logging Page

  - Misc

    [ ] Hover hints for buttons.  
    [ ] Dark-light theme toggling.

## Sources

- The sorting algorithm used in the useSort hook was adapted from [here](https://www.smashingmagazine.com/2020/03/sortable-tables-react/).
