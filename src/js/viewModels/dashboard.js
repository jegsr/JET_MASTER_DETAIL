/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(
  ['ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojlabel',
    'ojs/ojchart',
    'ojs/ojlistview',
    'ojs/ojarraydataprovider',
    'ojs/ojavatar'
  ],
  function (oj, ko, $) {

    function DashboardViewModel() {
      var self = this;  //generated code

      /**
       * Declare observables and read data from JSON file
       */
      // Master list and detail list observables
      self.activityDataProvider = ko.observable();   //gets data for Activities list
      self.itemsDataProvider = ko.observable();      //gets data for Items list
      self.itemData = ko.observable('');             //holds data for the Item details
      self.pieSeriesValue = ko.observableArray([]);  //holds data for pie chart

      //Activity selection observables
      self.activitySelected = ko.observable(false);
      self.selectedActivity = ko.observable();
      self.firstSelectedActivity = ko.observable();

      //Item selection observables
      self.itemSelected = ko.observable(false);
      self.selectedItem = ko.observable();
      self.firstSelectedItem = ko.observable();

      var url = "js/store_data.json";  //defines link to local data file

      // Get Activity objects from file using jQuery method and a method to return a Promise
      $.getJSON(url).then(function (data) {
        // Create variable for Activities list and populate using key attribute fetch
        var activitiesArray = data;
        self.activityDataProvider(new oj.ArrayDataProvider(activitiesArray, { keyAttributes: "id" }));
      }
      );

      /**
       * Handle selection from Activities list
       */
      self.selectedActivityChanged = function (event) {
        //Check whether click is an Activity selection or a deselection
        if (event.detail.value.length != 0) {
          //If selection, populate and display list
          //Create variable for items list using firstSelectedXxx API from List View
          var itemsArray = self.firstSelectedActivity().data.items;
          //Populate items list using DataProvider fetch on key attribute
          self.itemsDataProvider(new oj.ArrayDataProvider(itemsArray, { keyAttributes: "id" }));
          //Set List View properties
          self.activitySelected(true);
          self.itemSelected(false);
          //Clear item selection
          self.selectedItem([]);
          self.itemData();
        } else {
          //If deselection, hide list
          self.activitySelected(false);
          self.itemSelected(false);
        }
      }

      /**
       * Handle selection from Activity Items List
       */
      self.selectedItemChanged = function (event) {
        // Check whether click is an Activity Item selection or deselection
        if (event.detail.value.length != 0) {
          // If selection, populate and display list
          // Populate items list observable using firstSelectedXxx API
          self.itemData(self.firstSelectedItem().data);
          // Create variable and get attributes of the items list to set pie chart values
          var pieSeries = [
            { name: "Quantity in Stock", items: [self.itemData().quantity_instock] },
            { name: "Quantity Shipped", items: [self.itemData().quantity_shipped] }
          ];
          // Update the pie chart with the data
          self.pieSeriesValue(pieSeries);
          self.itemSelected(true);
        } else {
          // If deselection, hide list
          self.itemSelected(false);
        }
      };

      /**
       * Declare pie chart observables and provide static chart data
       */
      // chart selection drop-down observable
      self.val = ko.observable("pie");

      // toggle chart button observables
      self.stackValue = ko.observable('off');
      self.orientationValue = ko.observable('vertical');

      // chart data
      var barSeries = [{ name: "Baseball", items: [42, 34] },
      { name: "Bicycling", items: [55, 30] },
      { name: "Skiing", items: [36, 50] },
      { name: "Soccer", items: [22, 46] }];

      var barGroups = ["Group A", "Group B"];

      self.barSeriesValue = ko.observableArray(barSeries);
      self.barGroupsValue = ko.observableArray(barGroups);

      /**
       * This section is standard navdrawer starter template code
       */
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
        //self.activitySelected(false);
        //self.itemSelected(false);
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);