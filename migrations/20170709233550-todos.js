"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.changeColumn("todos", "completed", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: function(queryInterface, Sequelize) {
     queryInterface.changeColumn("todos", "completed", {
       type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null
    });
  }
};
