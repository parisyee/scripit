import React, { PropTypes } from "react";
import classNames from "classnames";

export default React.createClass({
  propTypes: {
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    onSectionSelect: PropTypes.func.isRequired,
    section: PropTypes.object.isRequired
  },

  handleSectionSelect: function() {
    this.props.onSectionSelect(this.props.index);
  },

  displayIndex: function() {
    return this.props.index + 1;
  },

  listItemClasses: function() {
    return classNames(
      "section-list-item",
      "uk-grid",
      "uk-grid-collapse",
      { active: this.props.active }
    );
  },

  sectionTitle: function() {
    return (
      this.props.section.title || `Section ${this.displayIndex()}`
    );
  },

  render: function() {
    return(
      <div
        className={this.listItemClasses()}
        onClick={this.handleSectionSelect}
      >
        <div className="uk-width-1-10 section-list-item-index">
          {this.displayIndex()}
        </div>
        <div className="uk-width-9-10 section-list-item-title">
          {this.sectionTitle()}
        </div>
      </div>
    );
  }
})

