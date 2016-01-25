var ScriptElement = React.createClass({
  ELEMENT_TYPES: {
    action: "action",
    character: "character",
    dialogue: "dialogue",
    heading: "heading",
    parenthetical: "parenthetical",
    transition: "transition"
  },

  KEYCODES: {
    backspace: 8,
    carriageRetrun: 13,
    tab: 9,
  },

  NEXT_ELEMENT_SEQUENCE_MAP: {
    "heading": "action",
    "action": "character",
    "character": "dialogue",
    "dialogue": "parenthetical",
    "parenthetical": "transition",
    "transition": "heading"
  },

  TYPE_COLOR_MAP: {
    "action": "lightgreen",
    "character": "lightblue",
    "dialogue": "yellow",
    "heading": "pink",
    "parenthetical": "lightgrey",
    "transition": "orange"
  },

  propTypes: {
    element: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    onElementCreated: React.PropTypes.func.isRequired,
    onElementRemoved: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return { element: this.props.element }
  },

  handleBackspaceKeydown: function(event) {
    if(this.state.element.text === "") {
      event.preventDefault();
      this.props.onElementRemoved(this.props.index)
    }
  },

  handleReturnKeydown: function() {
    if (this.state.element.text === "") {
      this.setState(function(oldState) {
        var element = oldState.element;
        element.type = this.NEXT_ELEMENT_SEQUENCE_MAP[element.type];

        return { element: element };
      }, this.handleChange);
    } else {
      this.props.onElementCreated(this.props.index);
    }
  },

  handleTabKeydown: function(event) {
    this.setState(function(oldState) {
      var newType;
      var element = oldState.element;

      if (event.shiftKey) {
        newType = this.ELEMENT_TYPES.transition;
      } else {
        newType = this.nextElementType(element.type);
      }
      element.type = newType;

      return { element: element };
    }, this.handleChange);
  },

  nextElementType: function(type) {
    return this.NEXT_ELEMENT_SEQUENCE_MAP[type];
  },

  bindCommandKeys: function() {
    var BACKSPACE_KEYCODE = this.KEYCODES.backspace;
    var CARRIAGE_RETRUN_KEYCODE = this.KEYCODES.carriageRetrun;
    var TAB_KEYCODE = this.KEYCODES.tab;
    var handleBackspaceKeydown = this.handleBackspaceKeydown;
    var handleReturnKeydown = this.handleReturnKeydown;
    var handleTabKeydown = this.handleTabKeydown;
    var node = ReactDOM.findDOMNode(this);

    $(node).keydown(function(event) {
      if (event.keyCode === BACKSPACE_KEYCODE) {
        handleBackspaceKeydown(event);
      }
      if (event.keyCode === CARRIAGE_RETRUN_KEYCODE) {
        event.preventDefault();
        handleReturnKeydown();
      }
      if (event.keyCode === TAB_KEYCODE) {
        event.preventDefault();
        handleTabKeydown(event);
      }
    });
  },

  bindHiddenInput: function() {
    var handleHiddenFieldInput = this.handleHiddenFieldInput;

    $("#" + this.elementHiddenInputID()).on("input", function() {
      handleHiddenFieldInput();
    });
  },

  populateDisplayInput: function() {
    this.refs.displayedField.innerText = this.state.element.text;
  },

  componentDidMount: function() {
    this.bindCommandKeys();
    this.bindHiddenInput();
    this.populateDisplayInput();
  },

  wrapperClassNames: function() {
    var classes = "script-element " + this.state.element.type;

    if (this.state.element.type === "character") {
      classes += " uk-width-2-10 uk-push-4-10 uk-text-center";
    } else if (this.state.element.type === "dialogue") {
      classes += " uk-width-5-10 uk-push-3-10";
    } else {
      classes += " uk-width-1-1";
    }

    return classes;
  },

  elementStyles: function() {
    var styles = {
      // background: this.TYPE_COLOR_MAP[this.state.element.type],
      width: "100%",
      minHeight: "20px",
      outline: "none",
      border: "none",
      "fontSize": "14px",
      "fontFamily": "'Courier New', Courier, monospace",
      "fontWeight": "bold"
    };

    if (this.state.element.type === "heading" ||
        this.state.element.type === "character" ||
        this.state.element.type === "transition"
       ) {
      styles.textTransform = "uppercase";
    }

    return styles;
  },

  displayedFieldClasses: function() {
    var classes = "displayedField";

    if (this.state.element.type !== "character") {
      classes += " uk-margin-bottom";
    }

    return classes;
  },

  elementID: function() {
    return this.state.element.type + "-" + this.props.index;
  },

  elementHiddenInputID: function() {
    return this.state.element.type + "-" + this.props.index + "-hidden-input";
  },

  handleInput: function(event) {
    this.setState(function(oldState) {
      var element = oldState.element;
      element.text = event.target.innerText;
      this.refs.hiddenField.value = event.target.innerText;
      $("#" + this.elementHiddenInputID()).trigger("input");

      return { element: element };
    });
  },

  handleHiddenFieldInput: function() {
    this.setState(function(oldState) {
      var element = oldState.element;
      element.text = $("#" + this.elementHiddenInputID()).val();

      return { element: element };
    }, this.handleChange);
  },

  handleChange: function() {
    this.props.onElementChange(this.props.index, this.state.element);
  },

  render: function() {
    return (
      <div
        id={this.elementID()}
        className={this.wrapperClassNames()}>
        <div
          className={this.displayedFieldClasses()}
          ref="displayedField"
          style={this.elementStyles()}
          onInput={this.handleInput}
          contentEditable="true">
        </div>
        <input
          id={this.elementHiddenInputID()}
          ref="hiddenField"
          onInput={this.handleHiddenFieldInput}
          className={"uk-hidden"}
          defaultValue={this.state.element.text} />
      </div>
    );
  }
});
